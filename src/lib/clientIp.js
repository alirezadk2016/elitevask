// Resolve the client IP as trustworthily as the platform allows.
//
// `x-forwarded-for` is client-settable, so its leftmost value can be spoofed.
// On Vercel the platform overwrites `x-vercel-forwarded-for` / `x-real-ip`
// with the real peer address, so prefer those and only fall back to XFF.
export function clientIp(request) {
  const h = request.headers;
  const vercel = h.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();
  const real = h.get('x-real-ip');
  if (real) return real.trim();
  const xff = h.get('x-forwarded-for');
  if (xff) {
    // Without a trusted platform header, the RIGHTMOST entry is the one added
    // by the closest proxy and is the hardest for a client to forge.
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}

// Sliding-window rate limit backed by KV so it holds across serverless
// instances. Fails CLOSED (returns false = blocked) only when explicitly told
// to; by default a KV outage must not take the site down.
export async function rateLimit(kv, key, max, windowSec, { failClosed = false } = {}) {
  if (!kv) return !failClosed;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, windowSec);
    return count <= max;
  } catch {
    return !failClosed;
  }
}
