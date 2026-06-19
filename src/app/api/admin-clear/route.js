import { isSameOrigin } from '@/lib/csrf';

function checkSecret(secret) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !secret) return false;
  // Prevent timing attacks on string comparison
  if (secret.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (!checkSecret(searchParams.get('secret'))) return new Response('forbidden', { status: 403 });
  return clearAll();
}

export async function POST(request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'forbidden' }, { status: 403 });
  const { secret } = await request.json().catch(() => ({}));
  if (!checkSecret(secret)) return Response.json({ error: 'forbidden' }, { status: 403 });
  return clearAll();
}

async function clearAll() {
  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return Response.json({ ok: false, warn: 'no_redis' });
    const kv = new Redis({ url, token });
    const [slotKeys, bookingKeys] = await Promise.all([kv.keys('slot:*'), kv.keys('booking:*')]);
    const all = [...slotKeys, ...bookingKeys];
    if (all.length > 0) await kv.del(...all);
    return Response.json({ ok: true, cleared: all.length, slots: slotKeys.length, bookings: bookingKeys.length });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
