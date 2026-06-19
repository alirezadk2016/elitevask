async function getKV() {
  const { Redis } = await import('@upstash/redis');
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function checkAuth(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

// Cancel booking (keeps record, frees slots, sets status=cancelled)
export async function PATCH(request) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { token } = await request.json().catch(() => ({}));
  if (!token) return Response.json({ error: 'missing_token' }, { status: 400 });
  try {
    const kv = await getKV();
    if (!kv) return Response.json({ error: 'no_redis' }, { status: 503 });
    const booking = await kv.get(`booking:${token}`);
    if (!booking) return Response.json({ error: 'not_found' }, { status: 404 });
    const data = typeof booking === 'string' ? JSON.parse(booking) : booking;
    data.status = 'cancelled';
    if (data.date && data.slots) {
      await Promise.all(data.slots.map(t => kv.del(`slot:${data.date}:${t}`)));
    }
    await kv.set(`booking:${token}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 30 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// Delete booking completely
export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { token } = await request.json().catch(() => ({}));
  if (!token) return Response.json({ error: 'missing_token' }, { status: 400 });
  try {
    const kv = await getKV();
    if (!kv) return Response.json({ error: 'no_redis' }, { status: 503 });
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
