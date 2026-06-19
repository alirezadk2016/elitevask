import nodemailer from 'nodemailer';
import { hashToken, getSession, auditLog } from '@/lib/auth';

const COMPANY_EMAIL = 'elitevask01@gmail.com';

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

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
}

export async function POST(request) {
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

  // Authorization: booking must belong to logged-in user — never trust client
  if ((booking.email || '').toLowerCase() !== session.email.toLowerCase()) {
    await auditLog(kv, 'unauthorized_cancel_attempt', { ip, emailHash: hashToken(session.email) });
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  if (booking.status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }

  // Backend enforces 24h rule — frontend check alone is never trusted
  if (booking.date && booking.time) {
    const dt = new Date(`${booking.date}T${booking.time}:00`);
    if ((dt - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({
        error: 'too_late',
        message: 'Booking kan ikke annulleres inden for 24 timer inden aftaletidspunktet. Kontakt os på +45 24 44 03 21.',
      }, { status: 409 });
    }
  }

  // Free reserved slots
  if (Array.isArray(booking.slots)) {
    for (const s of booking.slots) {
      try { await kv.del(`slot:${booking.date}:${s}`); } catch {}
    }
  }

  // Soft delete — never hard delete
  const cancelledAt = new Date().toISOString();
  await kv.set(`booking:${token}`, JSON.stringify({
    ...booking,
    status: 'cancelled',
    cancelledAt,
    cancelledBy: 'customer_portal',
  }), { keepttl: true });

  await auditLog(kv, 'booking_cancelled_portal', {
    ip,
    emailHash: hashToken(session.email),
    tokenRef: token.slice(0, 8),
  });

  // Send emails
  const transport = buildTransport();
  const { date, time, car, pkg, name, price, lang } = booking;
  const L = lang !== 'en';

  if (transport) {
    if (booking.email) {
      try {
        await transport.sendMail({
          from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
          to: booking.email,
          subject: L ? 'Din booking er annulleret – Elite Vask' : 'Your booking has been cancelled – Elite Vask',
          html: `<div style="font-family:sans-serif;max-width:540px;padding:28px 24px;background:#f9f9f9;border-radius:12px">
            <h2 style="color:#e74c3c;margin-bottom:8px">❌ ${L ? 'Booking annulleret' : 'Booking cancelled'}</h2>
            <p style="color:#555;margin-bottom:16px">${L ? `Hej ${name || ''}, vi bekræfter at din booking er annulleret.` : `Hi ${name || ''}, we confirm your booking has been cancelled.`}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
              <tr><td style="padding:8px 12px;background:#f0f0f0;color:#666;width:40%">${L ? 'Dato & tid' : 'Date & time'}</td><td style="padding:8px 12px;background:#f0f0f0;font-weight:600">${date} kl. ${time}</td></tr>
              <tr><td style="padding:8px 12px;color:#666">${L ? 'Bil' : 'Car'}</td><td style="padding:8px 12px;font-weight:600">${car}</td></tr>
              <tr><td style="padding:8px 12px;background:#f0f0f0;color:#666">${L ? 'Pakke' : 'Package'}</td><td style="padding:8px 12px;background:#f0f0f0;font-weight:600">${pkg}</td></tr>
            </table>
            <a href="https://elitevask.vercel.app" style="display:inline-block;background:#37d278;color:#062313;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">${L ? 'Book ny tid' : 'Book new time'}</a>
          </div>`,
        });
      } catch {}
    }
    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject: `❌ Annullering (portal): ${car} – ${date} ${time}`,
        html: `<div style="font-family:sans-serif;max-width:540px;padding:24px;background:#fff3f3;border-radius:12px">
          <h2 style="color:#e74c3c">❌ Annulleret via kundeportal</h2>
          <p><strong>Dato:</strong> ${date} kl. ${time}</p>
          <p><strong>Navn:</strong> ${name || '-'}</p>
          <p><strong>Email:</strong> ${booking.email || '-'}</p>
          <p><strong>Telefon:</strong> ${booking.phone || '-'}</p>
          <p><strong>Bil:</strong> ${car} · ${pkg}</p>
          <p><strong>Pris:</strong> ${price || '-'}</p>
          <p><strong>Annulleret:</strong> ${cancelledAt}</p>
        </div>`,
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
