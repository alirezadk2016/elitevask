export async function DELETE(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 });
  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const { token } = await request.json().catch(() => ({}));
  if (!token) return Response.json({ error: 'missing_token' }, { status: 400 });

  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !kvToken) return Response.json({ error: 'no_redis' }, { status: 503 });

    const kv = new Redis({ url, token: kvToken });

    // Also free up the slots
    const booking = await kv.get(`booking:${token}`);
    if (booking) {
      const data = typeof booking === 'string' ? JSON.parse(booking) : booking;
      if (data.date && data.slots) {
        await Promise.all(data.slots.map(t => kv.del(`slot:${data.date}:${t}`)));
      }
    }

    await kv.del(`booking:${token}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
