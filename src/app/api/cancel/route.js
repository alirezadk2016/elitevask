import { isSameOrigin } from '@/lib/csrf';
import { clientIp, rateLimit } from '@/lib/clientIp';
import { cphEpoch } from '@/lib/cphTime';
import { buildTransport, emailShell, tr, esc, BOOKING_EMAIL, INFO_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

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
  } catch {
    return null;
  }
}

// All reserved slot keys for a booking.
//
// Only ever derived from data the booking itself carries: the stored slots[]
// list, or an explicit duration (durationMin / slotsNeeded, both written by
// the booking API together with the slot interval it used). We deliberately do
// NOT guess a duration from carId — a wrong guess deletes slot keys belonging
// to the NEXT booking, which would silently free an occupied hour and allow a
// double booking on top of an active job. Records with no duration info are
// swept by scanning the day's actual slot keys instead (see sweepSlots).
function slotTimesFor(booking) {
  const { time, slots, slotsNeeded, durationMin, slotMinutes } = booking;
  if (Array.isArray(slots) && slots.length) return slots;
  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) return [];
  const step = [15, 30, 60].includes(slotMinutes) ? slotMinutes : 30;
  const dur = durationMin || (slotsNeeded ? slotsNeeded * step : 0);
  if (!dur) return [];
  const [h, m] = time.split(':').map(Number);
  const start = h * 60 + (m || 0);
  const out = [];
  for (let t = start; t < start + dur; t += step) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  }
  return out;
}

// Release the slots a booking reserved. When the record carries no usable
// duration (very old bookings), fall back to scanning that day's slot keys and
// deleting only those whose stored value points at THIS booking's token — that
// can never touch another booking's reservation.
// Delete a slot key only when it still belongs to this booking, so a stale
// slots[] list can never wipe a reservation made since.
async function delOwnedSlot(kv, key, token) {
  try {
    const raw = await kv.get(key);
    if (raw === null || raw === undefined) return;
    const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (val && val.token && val.token !== token) return;
    await kv.del(key);
  } catch {}
}

async function releaseBookingSlots(kv, booking, token) {
  const times = slotTimesFor(booking);
  if (times.length) {
    for (const t of times) {
      await delOwnedSlot(kv, `slot:${booking.date}:${t}`, token);
    }
    return;
  }
  if (!booking.date) return;
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

// GET /api/cancel?token=xxx — look up booking
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'Service unavailable' }, { status: 503 });

  const booking = await kv.get(`booking:${token}`);
  if (!booking) return Response.json({ error: 'not_found' }, { status: 404 });

  const data = typeof booking === 'string' ? JSON.parse(booking) : booking;

  if (data.status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }
  // Inside the 24h window: tell the page up front (423) so it shows the
  // "call us — your booking is still active" card instead of a confirm button
  // that could only fail. This is checked BEFORE cancelExpiresAt because for a
  // booking made less than 24h ahead that timestamp is already in the past at
  // creation, which would otherwise show a misleading "link expired".
  if (data.date && data.time) {
    const dt = cphEpoch(data.date, data.time);
    if (Number.isNaN(dt) || (dt - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({ error: 'too_late' }, { status: 423 });
    }
  } else if (data.cancelExpiresAt && new Date(data.cancelExpiresAt) < new Date()) {
    return Response.json({ error: 'link_expired' }, { status: 410 });
  }

  // Return only what the page needs — no internal fields
  return Response.json({
    date: data.date,
    time: data.time,
    car: data.car,
    pkg: data.pkg,
    name: data.name,
    lang: data.lang || 'da',
  });
}

// POST /api/cancel — cancel booking by token (used from /annuller page)
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return Response.json({ error: 'invalid_token' }, { status: 400 });
  }

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'Service unavailable' }, { status: 503 });

  // Global (KV-backed) limit so the endpoint can't be hammered to probe tokens.
  if (!(await rateLimit(kv, `rl:cancel:${clientIp(request)}`, 10, 300))) {
    return Response.json({ error: 'rate_limit', message: 'For mange forsøg. Prøv igen om lidt.' }, { status: 429 });
  }

  const raw = await kv.get(`booking:${token}`);
  if (!raw) return Response.json({ error: 'not_found' }, { status: 404 });

  const booking = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const { date, slots, name, email, car, pkg, price, lang, cancelExpiresAt, status } = booking;
  const L = lang !== 'en';

  // Reject already-cancelled bookings
  if (status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }

  // 24h rule first (423), then the link-expiry fallback — see the GET handler:
  // for a same-day booking cancelExpiresAt is already past at creation, so
  // checking it first would show "link expired" instead of "call us".
  if (date && booking.time) {
    const dt = cphEpoch(date, booking.time);
    if (Number.isNaN(dt) || (dt - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({ error: 'too_late', message: L
        ? 'Kan ikke annulleres inden for 24 timer. Ring venligst til os på +45 24 44 03 21.'
        : 'Cannot be cancelled within 24 hours. Please call us on +45 24 44 03 21.' }, { status: 423 });
    }
  } else if (cancelExpiresAt && new Date(cancelExpiresAt) < new Date()) {
    return Response.json({ error: 'link_expired' }, { status: 410 });
  }

  // Short-lived NX lock: two simultaneous cancel clicks must not both run the
  // free-slots + email sequence (the second could free a slot someone else
  // just rebooked). 'busy' (429), never 'already_cancelled' — the booking is
  // still active at this point and must not be reported as cancelled.
  let locked = false;
  try {
    locked = !!(await kv.set(`cancel-lock:${token}`, 1, { nx: true, ex: 30 }));
    if (!locked) {
      return Response.json({ error: 'busy', message: L
        ? 'Annulleringen behandles allerede. Vent et øjeblik og opdater siden.'
        : 'This cancellation is already being processed. Please wait a moment and refresh.' }, { status: 429 });
    }
  } catch {
    // KV error on the lock: proceed (a missed lock is better than blocking a
    // legitimate cancellation) but log it so it isn't silent.
    console.error('[cancel] lock unavailable — proceeding without it', token.slice(0, 8));
  }

  // Persist the cancellation FIRST: if the write fails we must not have freed
  // slots for a booking that still reads as confirmed.
  const cancelled = JSON.stringify({ ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() });
  let saved = false;
  for (let i = 0; i < 2 && !saved; i++) {
    try { await kv.set(`booking:${token}`, cancelled, { ex: 60 * 60 * 24 * 60 }); saved = true; } catch {}
  }
  if (!saved) {
    if (locked) { try { await kv.del(`cancel-lock:${token}`); } catch {} }
    return Response.json({ error: 'store_failed', message: L
      ? 'Vi kunne ikke gennemføre annulleringen. Ring venligst til os på +45 24 44 03 21.'
      : 'We could not complete the cancellation. Please call us on +45 24 44 03 21.' }, { status: 503 });
  }

  // Free the slots this booking actually reserved.
  await releaseBookingSlots(kv, booking, token);

  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;
  const transport = buildTransport();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://elite-vask.dk';

  if (transport) {
    if (email) {
      try {
        await transport.sendMail({
          from: `"Elite Vask" <${senderUser}>`,
          to: email,
          replyTo: CONTACT_EMAIL,
          subject: L ? 'Din booking er annulleret – Elite Vask' : 'Your booking has been cancelled – Elite Vask',
          html: emailShell({
            title: L ? '❌ Booking annulleret' : '❌ Booking cancelled',
            preheader: L ? `Din booking den ${date} kl. ${booking.time} er nu annulleret.` : `Your booking on ${date} at ${booking.time} has been cancelled.`,
            lang: lang || 'da',
            body: `
              <p style="color:#333;margin:0 0 20px;font-size:15px;line-height:1.7">
                ${L ? `Hej ${esc(name) || ''},` : `Hi ${esc(name) || ''},`}<br><br>
                ${L ? 'Vi bekræfter, at din booking er annulleret.' : 'We confirm that your booking has been cancelled.'}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
                ${tr(L ? 'Dato & tid' : 'Date & time', `${esc(date)} · kl. ${esc(booking.time)}`, true)}
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
        replyTo: email || CONTACT_EMAIL,
        subject: `❌ Annullering: ${car || ''} – ${date} kl. ${booking.time}`,
        html: emailShell({
          title: 'Booking annulleret af kunde',
          lang: 'da',
          body: `
            <p style="color:#333;margin:0 0 16px;font-size:14px">En kunde har annulleret sin booking via hjemmesiden.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
              ${tr('Dato & tid', `${esc(date)} · kl. ${esc(booking.time)}`, true)}
              ${tr('Bil', `${esc(car) || '-'} · ${esc(pkg) || '-'}`)}
              ${tr('Pris', esc(price) || '-', true)}
              ${tr('Navn', esc(name) || '-')}
              ${tr('Email', email ? `<a href="mailto:${esc(email)}" style="color:#0d4a25">${esc(email)}</a>` : '-', true)}
              ${tr('Telefon', booking.phone ? `<a href="tel:${esc((booking.phone||'').replace(/[^\d+]/g,''))}" style="color:#0d4a25">${esc(booking.phone)}</a>` : '-')}
            </table>
          `,
        }),
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
