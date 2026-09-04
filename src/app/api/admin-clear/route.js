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

/* This endpoint deletes EVERY booking and EVERY slot lock in one call, and it
   is not referenced anywhere in the app — it is a development reset that was
   left reachable in production. One successful call destroys the business's
   entire calendar with no undo, so in production it now stays shut unless the
   operator deliberately sets ALLOW_DESTRUCTIVE_RESET=1 for the duration of a
   reset. Locally (npm run dev) it behaves exactly as before. */
function resetAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_DESTRUCTIVE_RESET === '1';
}

export async function POST(request) {
  if (!resetAllowed()) return Response.json({ error: 'disabled' }, { status: 404 });
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
