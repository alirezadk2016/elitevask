import { hashToken, getSession, auditLog } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';
import { buildTransport, emailShell, tr, BOOKING_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

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
    const dt = new Date(`${booking.date}T${booking.time}:00+02:00`);
    if ((dt.getTime() - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({ error: 'too_late', message: 'Kan ikke annulleres inden for 24 timer.' }, { status: 409 });
    }
  }

  if (Array.isArray(booking.slots)) {
    for (const s of booking.slots) {
      try { await kv.del(`slot:${booking.date}:${s}`); } catch {}
    }
  }

  const cancelledAt = new Date().toISOString();
  await kv.set(`booking:${token}`, JSON.stringify({ ...booking, status: 'cancelled', cancelledAt, cancelledBy: 'portal' }), { ex: 60 * 60 * 24 * 60 });
  await auditLog(kv, 'booking_cancelled_portal', { ip, emailHash: hashToken(session.email), tokenRef: token.slice(0, 8) });

  const { date, time, car, pkg, name, price, lang } = booking;
  const L = lang !== 'en';
  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-vask.dk';
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
                ${L ? `Hej ${name || ''},` : `Hi ${name || ''},`}<br><br>
                ${L ? 'Vi bekræfter, at din booking er annulleret via kundeportalen.' : 'We confirm that your booking has been cancelled via the customer portal.'}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
                ${tr(L ? 'Dato & tid' : 'Date & time', `${date} · kl. ${time}`, true)}
                ${tr(L ? 'Bil' : 'Car', car || '-')}
                ${tr(L ? 'Pakke' : 'Package', pkg || '-', true)}
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
              ${tr('Dato & tid', `${date} · kl. ${time}`, true)}
              ${tr('Bil', `${car || '-'} · ${pkg || '-'}`)}
              ${tr('Pris', price || '-', true)}
              ${tr('Navn', name || '-')}
              ${tr('Email', booking.email ? `<a href="mailto:${booking.email}" style="color:#0d4a25">${booking.email}</a>` : '-', true)}
              ${tr('Telefon', booking.phone ? `<a href="tel:${(booking.phone||'').replace(/\s/g,'')}" style="color:#0d4a25">${booking.phone}</a>` : '-')}
            </table>
          `,
        }),
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
