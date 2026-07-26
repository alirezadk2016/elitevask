import { randomBytes } from 'crypto';
import { hashToken, makeSessionCookie, auditLog } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';

const SESSION_TTL = 60 * 60 * 24 * 30;

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

// GET no longer consumes the token: corporate mail scanners (SafeLinks,
// Mimecast, …) prefetch links with GET and would burn the single-use token
// before the user ever clicked. GET just forwards to the interstitial page,
// which POSTs the token on an explicit user click.
export async function GET(request) {
  const reqUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || `${reqUrl.protocol}//${reqUrl.host}`;
  const rawToken = reqUrl.searchParams.get('token');
  if (!rawToken || rawToken.length !== 64) {
    return Response.redirect(`${siteUrl}/portal/login?error=invalid`);
  }
  return Response.redirect(`${siteUrl}/portal/verify?token=${encodeURIComponent(rawToken)}`);
}

// POST { token } — consumes the single-use token and creates the session.
export async function POST(request) {
  // Same-origin only: without this a malicious page could force a victim's
  // browser to log in to the ATTACKER's account (session fixation).
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  const rawToken = body.token;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ua = request.headers.get('user-agent') || '';

  if (!rawToken || typeof rawToken !== 'string' || rawToken.length !== 64) {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'unavailable' }, { status: 503 });

  const hashed = hashToken(rawToken);

  // Atomic delete-and-read: prevents replay even under concurrent requests.
  // GETDEL returns the value and deletes in one operation — no race window.
  let raw;
  try {
    raw = await kv.getdel(`magic:${hashed}`);
  } catch {
    // Fallback for clients that don't support GETDEL
    raw = await kv.get(`magic:${hashed}`);
    if (raw) await kv.del(`magic:${hashed}`);
  }

  if (!raw) {
    await auditLog(kv, 'magic_link_not_found_or_replayed', { ip, ua });
    return Response.json({ error: 'expired' }, { status: 410 });
  }

  const magic = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (new Date(magic.expiresAt) < new Date()) {
    await auditLog(kv, 'magic_link_expired', { ip, ua });
    return Response.json({ error: 'expired' }, { status: 410 });
  }

  // Create session
  const sessionRaw = randomBytes(32).toString('hex');
  const sessionHash = hashToken(sessionRaw);
  const expiresAt = new Date(Date.now() + SESSION_TTL * 1000).toISOString();

  await kv.set(`session:${sessionHash}`, JSON.stringify({
    email: magic.email,
    createdAt: new Date().toISOString(),
    expiresAt,
  }), { ex: SESSION_TTL });

  await auditLog(kv, 'login_success', { emailHash: hashToken(magic.email), ip, ua });

  return Response.json({ ok: true }, {
    headers: { 'Set-Cookie': makeSessionCookie(sessionRaw) },
  });
}
