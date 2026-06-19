export async function GET(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 });
  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return Response.json({ bookings: [] });

    const kv = new Redis({ url, token });
    const keys = await kv.keys('booking:*');
    if (!keys.length) return Response.json({ bookings: [] });

    const values = await Promise.all(keys.map(k => kv.get(k)));
    const bookings = values
      .map((v, i) => {
        try {
          const data = typeof v === 'string' ? JSON.parse(v) : v;
          return { token: keys[i].replace('booking:', ''), ...data };
        } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

    return Response.json({ bookings });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
