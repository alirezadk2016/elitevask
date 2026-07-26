import { hashToken, getSession, auditLog } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';
import { cphEpoch } from '@/lib/cphTime';
import { buildTransport, emailShell, tr, esc, BOOKING_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

let kvClient = null;
async function getKV() {
  if (kvClient) return kvClient;
  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return null;
    kvClient = new Redis({ url, token });
    return kvClient;
  } catch { return null; }
}

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'unavailable' }, { status: 503 });

  const session = await getSession(request, kv);
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return Response.json({ error: 'invalid_token' }, { status: 400 });
  }

  const raw = await kv.get(`booking:${token}`);
  if (!raw) return Response.json({ error: 'not_found' }, { status: 404 });

  const booking = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if ((booking.email || '').toLowerCase() !== session.email.toLowerCase()) {
    await auditLog(kv, 'unauthorized_cancel', { ip, emailHash: hashToken(session.email) });
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  if (booking.status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }

  if (booking.date && booking.time) {
    const dt = cphEpoch(booking.date, booking.time);
    // Malformed date/time → treat as "too late" rather than skipping the guard.
    if (Number.isNaN(dt) || (dt - Date.now()) < 24 * 3600 * 1000) {
      // 423, not 409 — must never be confused with 'already cancelled'.
      return Response.json({ error: 'too_late', message: 'Kan ikke annulleres inden for 24 timer. Ring til os på +45 24 44 03 21.' }, { status: 423 });
    }
  }

  // Short-lived NX lock: two simultaneous cancel clicks must not both run the
  // free-slots + email sequence. 'busy' (429), never 'already_cancelled' —
  // the booking is still active here and must not be reported as cancelled.
  let locked = false;
  try {
    locked = !!(await kv.set(`cancel-lock:${token}`, 1, { nx: true, ex: 30 }));
    if (!locked) {
      return Response.json({ error: 'busy', message: 'Annulleringen behandles allerede. Vent et øjeblik og opdater siden.' }, { status: 429 });
    }
  } catch {
    console.error('[customer/cancel] lock unavailable — proceeding without it', token.slice(0, 8));
  }

  // Persist FIRST: never free slots for a booking that still reads as confirmed.
  const cancelledAt = new Date().toISOString();
  const record = JSON.stringify({ ...booking, status: 'cancelled', cancelledAt, cancelledBy: 'portal' });
  let saved = false;
  for (let i = 0; i < 2 && !saved; i++) {
    try { await kv.set(`booking:${token}`, record, { ex: 60 * 60 * 24 * 60 }); saved = true; } catch {}
  }
  if (!saved) {
    if (locked) { try { await kv.del(`cancel-lock:${token}`); } catch {} }
    return Response.json({ error: 'store_failed', message: 'Vi kunne ikke gennemføre annulleringen. Ring venligst til os på +45 24 44 03 21.' }, { status: 503 });
  }

  // Free exactly the slots this booking reserved. Never guess a duration from
  // carId — a wrong guess would delete the NEXT booking's slot keys.
  const slotTimes = (() => {
    if (Array.isArray(booking.slots) && booking.slots.length) return booking.slots;
    if (!booking.time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(booking.time)) return [];
    const step = [15, 30, 60].includes(booking.slotMinutes) ? booking.slotMinutes : 30;
    const dur = booking.durationMin || (booking.slotsNeeded ? booking.slotsNeeded * step : 0);
    if (!dur) return [];
    const [h, m] = booking.time.split(':').map(Number);
    const start = h * 60 + (m || 0);
    const out = [];
    for (let t = start; t < start + dur; t += step) {
      out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
    }
    return out;
  })();
  if (slotTimes.length) {
    for (const s of slotTimes) {
      try { await kv.del(`slot:${booking.date}:${s}`); } catch {}
    }
  } else if (booking.date) {
    // No duration info (very old record): delete only the day's slot keys that
    // point at THIS token — can never touch another booking's reservation.
    try {
      const keys = await kv.keys(`slot:${booking.date}:*`);
      for (const key of keys) {
        try {
          const raw = await kv.get(key);
          const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (val && val.token === token) await kv.del(key);
        } catch {}
      }
    } catch {}
  }

  try { await auditLog(kv, 'booking_cancelled_portal', { ip, emailHash: hashToken(session.email), tokenRef: token.slice(0, 8) }); } catch {}

  const { date, time, car, pkg, name, price, lang } = booking;
  const L = lang !== 'en';
  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://elite-vask.dk';
  const transport = buildTransport();

  if (transport) {
    if (booking.email) {
      try {
        await transport.sendMail({
          from: `"Elite Vask" <${senderUser}>`,
          to: booking.email,
          replyTo: CONTACT_EMAIL,
          subject: L ? 'Din booking er annulleret – Elite Vask' : 'Your booking has been cancelled – Elite Vask',
          html: emailShell({
            title: L ? '❌ Booking annulleret' : '❌ Booking cancelled',
            preheader: L ? `Din booking den ${date} kl. ${time} er nu annulleret.` : `Your booking on ${date} at ${time} has been cancelled.`,
            lang: lang || 'da',
            body: `
              <p style="color:#333;margin:0 0 20px;font-size:15px;line-height:1.7">
                ${L ? `Hej ${esc(name) || ''},` : `Hi ${esc(name) || ''},`}<br><br>
                ${L ? 'Vi bekræfter, at din booking er annulleret via kundeportalen.' : 'We confirm that your booking has been cancelled via the customer portal.'}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
                ${tr(L ? 'Dato & tid' : 'Date & time', `${esc(date)} · kl. ${esc(time)}`, true)}
                ${tr(L ? 'Bil' : 'Car', esc(car) || '-')}
                ${tr(L ? 'Pakke' : 'Package', esc(pkg) || '-', true)}
              </table>
              <p style="color:#555;margin:0 0 20px;font-size:14px;line-height:1.6">
                ${L ? 'Ønsker du at booke en ny tid, er du altid velkommen.' : 'You are always welcome to book a new time.'}
              </p>
              <a href="${siteUrl}" style="display:inline-block;background:#0d4a25;color:#ffffff;padding:12px 26px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px">
                ${L ? 'Book ny tid' : 'Book new time'}
              </a>
            `,
          }),
        });
      } catch {}
    }
    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${senderUser}>`,
        to: BOOKING_EMAIL,
        replyTo: booking.email || CONTACT_EMAIL,
        subject: `❌ Annullering (portal): ${car || ''} – ${date} kl. ${time}`,
        html: emailShell({
          title: 'Annulleret via kundeportal',
          lang: 'da',
          body: `
            <p style="color:#333;margin:0 0 16px;font-size:14px">En kunde har annulleret sin booking via kundeportalen.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
              ${tr('Dato & tid', `${esc(date)} · kl. ${esc(time)}`, true)}
              ${tr('Bil', `${esc(car) || '-'} · ${esc(pkg) || '-'}`)}
              ${tr('Pris', esc(price) || '-', true)}
              ${tr('Navn', esc(name) || '-')}
              ${tr('Email', booking.email ? `<a href="mailto:${esc(booking.email)}" style="color:#0d4a25">${esc(booking.email)}</a>` : '-', true)}
              ${tr('Telefon', booking.phone ? `<a href="tel:${esc((booking.phone||'').replace(/[^\d+]/g,''))}" style="color:#0d4a25">${esc(booking.phone)}</a>` : '-')}
            </table>
          `,
        }),
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
