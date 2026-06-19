import nodemailer from 'nodemailer';
import { isSameOrigin } from '@/lib/csrf';

const COMPANY_EMAIL = 'elitevask01@gmail.com';
const SITE_URL = 'https://elitevask.vercel.app';

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

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass },
  });
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

  // Free all booked slots
  if (Array.isArray(slots)) {
    for (const slotTime of slots) {
      try { await kv.del(`slot:${date}:${slotTime}`); } catch {}
    }
  }

  // Soft delete — mark as cancelled instead of deleting
  try {
    await kv.set(`booking:${token}`, JSON.stringify({ ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() }), { keepttl: true });
  } catch {
    await kv.del(`booking:${token}`);
  }

  const transport = buildTransport();

  // Email to customer
  if (transport && email) {
    try {
      await transport.sendMail({
        from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: email,
        subject: L ? 'Din booking er annulleret – Elite Vask' : 'Your booking has been cancelled – Elite Vask',
        html: `<div style="font-family:sans-serif;max-width:540px;padding:24px;background:#f9f9f9;border-radius:12px">
          <h2 style="color:#e74c3c">${L ? '❌ Booking annulleret' : '❌ Booking cancelled'}</h2>
          <p>${L ? `Hej ${name}, vi bekræfter at din booking er annulleret.` : `Hi ${name}, we confirm your booking has been cancelled.`}</p>
          <p><strong>${L ? 'Dato' : 'Date'}:</strong> ${date} ${booking.time}</p>
          <p><strong>${L ? 'Bil' : 'Car'}:</strong> ${car}</p>
          <p><strong>${L ? 'Pakke' : 'Package'}:</strong> ${pkg}</p>
          <hr style="margin:16px 0">
          <p>${L ? 'Ønsker du at booke igen, er du altid velkommen.' : 'You are always welcome to book again.'}</p>
          <a href="${SITE_URL}" style="display:inline-block;margin-top:8px;background:#37d278;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700">${L ? 'Book ny tid' : 'Book new time'}</a>
        </div>`,
      });
    } catch {}
  }

  // Email to company
  if (transport) {
    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject: `❌ Annullering: ${car} – ${date} ${booking.time}`,
        html: `<div style="font-family:sans-serif;max-width:540px;padding:24px;background:#fff3f3;border-radius:12px">
          <h2 style="color:#e74c3c">❌ Booking annulleret af kunde</h2>
          <p><strong>Dato:</strong> ${date} ${booking.time}</p>
          <p><strong>Navn:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || '-'}</p>
          <p><strong>Telefon:</strong> ${booking.phone || '-'}</p>
          <p><strong>Bil:</strong> ${car} · ${pkg}</p>
          <p><strong>Pris:</strong> ${price || '-'}</p>
        </div>`,
      });
    } catch {}
  }

  return Response.json({ ok: true });
}
