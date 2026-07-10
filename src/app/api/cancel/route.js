import { isSameOrigin } from '@/lib/csrf';
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

// GET /api/cancel?token=xxx — look up booking
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'Service unavailable' }, { status: 503 });

  const booking = await kv.get(`booking:${token}`);
  if (!booking) return Response.json({ error: 'not_found' }, { status: 404 });

  const data = typeof booking === 'string' ? JSON.parse(booking) : booking;

  if (data.status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }
  if (data.cancelExpiresAt && new Date(data.cancelExpiresAt) < new Date()) {
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

  const raw = await kv.get(`booking:${token}`);
  if (!raw) return Response.json({ error: 'not_found' }, { status: 404 });

  const booking = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const { date, slots, name, email, car, pkg, price, lang, cancelExpiresAt, status } = booking;
  const L = lang !== 'en';

  // Reject already-cancelled bookings
  if (status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }

  // Reject expired cancel links
  if (cancelExpiresAt && new Date(cancelExpiresAt) < new Date()) {
    return Response.json({ error: 'link_expired' }, { status: 410 });
  }

  // Same 24h rule as the customer portal
  if (date && booking.time) {
    const dt = cphEpoch(date, booking.time);
    if (Number.isNaN(dt) || (dt - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({ error: 'too_late', message: L
        ? 'Kan ikke annulleres inden for 24 timer. Ring venligst til os på +45 24 44 03 21.'
        : 'Cannot be cancelled within 24 hours. Please call us on +45 24 44 03 21.' }, { status: 409 });
    }
  }

  // Free all booked slots
  if (Array.isArray(slots)) {
    for (const slotTime of slots) {
      try { await kv.del(`slot:${date}:${slotTime}`); } catch {}
    }
  }

  // Soft delete — mark as cancelled instead of deleting. If the write fails,
  // retry; never delete the record (it must stay visible in the admin).
  const cancelled = JSON.stringify({ ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() });
  try {
    await kv.set(`booking:${token}`, cancelled, { ex: 60 * 60 * 24 * 60 });
  } catch {
    try { await kv.set(`booking:${token}`, cancelled, { ex: 60 * 60 * 24 * 60 }); } catch {}
  }

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
