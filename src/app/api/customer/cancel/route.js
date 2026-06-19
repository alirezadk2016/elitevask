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

  // Authorization: booking must belong to logged-in user
  if ((booking.email || '').toLowerCase() !== session.email.toLowerCase()) {
    await auditLog(kv, 'unauthorized_cancel', { ip, emailHash: hashToken(session.email) });
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  if (booking.status === 'cancelled') {
    return Response.json({ error: 'already_cancelled' }, { status: 409 });
  }

  // Backend 24h rule
  if (booking.date && booking.time) {
    const dt = new Date(`${booking.date}T${booking.time}:00`);
    if ((dt - Date.now()) < 24 * 3600 * 1000) {
      return Response.json({ error: 'too_late', message: 'Kan ikke annulleres inden for 24 timer.' }, { status: 409 });
    }
  }

  // Free slots
  if (Array.isArray(booking.slots)) {
    for (const s of booking.slots) {
      try { await kv.del(`slot:${booking.date}:${s}`); } catch {}
    }
  }

  const cancelledAt = new Date().toISOString();
  await kv.set(`booking:${token}`, JSON.stringify({ ...booking, status: 'cancelled', cancelledAt, cancelledBy: 'portal' }), { keepttl: true });

  await auditLog(kv, 'booking_cancelled_portal', { ip, emailHash: hashToken(session.email), tokenRef: token.slice(0, 8) });

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
          html: `<div style="font-family:sans-serif;max-width:540px;padding:24px;background:#f9f9f9;border-radius:12px">
            <h2 style="color:#e74c3c">❌ ${L ? 'Booking annulleret' : 'Booking cancelled'}</h2>
            <p>${L ? `Hej ${name || ''}, din booking er nu annulleret.` : `Hi ${name || ''}, your booking has been cancelled.`}</p>
            <p><strong>${L ? 'Dato' : 'Date'}:</strong> ${date} ${time}</p>
            <p><strong>${L ? 'Bil' : 'Car'}:</strong> ${car} · ${pkg}</p>
            <a href="https://elitevask.vercel.app" style="display:inline-block;margin-top:12px;background:#37d278;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700">${L ? 'Book ny tid' : 'Book new time'}</a>
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
          <p><strong>Dato:</strong> ${date} ${time}</p><p><strong>Navn:</strong> ${name}</p>
          <p><strong>Email:</strong> ${booking.email}</p><p><strong>Telefon:</strong> ${booking.phone || '-'}</p>
          <p><strong>Bil:</strong> ${car} · ${pkg}</p><p><strong>Pris:</strong> ${price || '-'}</p>
        </div>`,
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
