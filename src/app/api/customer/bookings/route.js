import { hashToken, getSession } from '@/lib/auth';

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

export async function GET(request) {
  const kv = await getKV();
  if (!kv) return Response.json({ error: 'unavailable' }, { status: 503 });

  const session = await getSession(request, kv);
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const email = session.email.toLowerCase();
  const tokens = await kv.smembers(`user:bookings:${hashToken(email)}`);
  if (!tokens || !tokens.length) return Response.json({ bookings: [] });

  const bookings = [];
  for (const token of tokens) {
    try {
      const raw = await kv.get(`booking:${token}`);
      if (!raw) continue;
      const b = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if ((b.email || '').toLowerCase() !== email) continue; // ownership check
      const bookingDt = b.date && b.time ? new Date(`${b.date}T${b.time}:00`) : null;
      const canCancel = bookingDt ? (bookingDt - Date.now()) > 24 * 3600 * 1000 : false;
      bookings.push({
        token,
        date: b.date,
        time: b.time,
        car: b.car,
        pkg: b.pkg,
        price: b.price,
        status: b.status || 'confirmed',
        bookedAt: b.bookedAt,
        cancelledAt: b.cancelledAt || null,
        addr: b.addr ? `${b.addr}, ${b.zip || ''} ${b.city || ''}`.trim() : null,
        canCancel: b.status !== 'cancelled' && canCancel,
      });
    } catch {}
  }

  bookings.sort((a, b) => {
    const da = a.date && a.time ? new Date(`${a.date}T${a.time}`) : new Date(0);
    const db = b.date && b.time ? new Date(`${b.date}T${b.time}`) : new Date(0);
    return db - da;
  });

  return Response.json({ bookings, email });
}
