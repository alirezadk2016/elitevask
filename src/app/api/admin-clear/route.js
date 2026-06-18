export async function POST(request) {
  const { secret } = await request.json().catch(() => ({}));
  if (secret !== 'elitevask-clear-2026') return Response.json({ error: 'forbidden' }, { status: 403 });
  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return Response.json({ ok: false, warn: 'no_redis' });
    const kv = new Redis({ url, token });
    const keys = await kv.keys('slot:*');
    if (keys.length > 0) await kv.del(...keys);
    return Response.json({ ok: true, cleared: keys.length, keys });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
