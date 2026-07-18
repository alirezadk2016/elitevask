import { createHash, timingSafeEqual } from 'crypto';

// Timing-safe check of an Authorization: Bearer <ADMIN_SECRET> header.
// Hashes both sides first so a length mismatch can't throw and comparison
// time never leaks the secret length. Returns false when no secret is set
// (never accepts "Bearer undefined").
export function checkBearer(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') || '';
  const a = createHash('sha256').update(header).digest();
  const b = createHash('sha256').update(`Bearer ${secret}`).digest();
  return timingSafeEqual(a, b);
}
