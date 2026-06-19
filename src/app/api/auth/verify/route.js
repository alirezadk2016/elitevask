import { randomBytes } from 'crypto';
import { hashToken, makeSessionCookie, auditLog } from '@/lib/auth';

const SITE_URL = 'https://elitevask.vercel.app';
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get('token');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ua = request.headers.get('user-agent') || '';

  if (!rawToken || rawToken.length !== 64) {
    return Response.redirect(`${SITE_URL}/portal/login?error=invalid`, 302);
  }

  const kv = await getKV();
  if (!kv) return Response.redirect(`${SITE_URL}/portal/login?error=unavailable`, 302);

  const hashed = hashToken(rawToken);
  const raw = await kv.get(`magic:${hashed}`);

  if (!raw) {
    await auditLog(kv, 'magic_link_not_found', { ip, ua });
    return Response.redirect(`${SITE_URL}/portal/login?error=expired`, 302);
  }

  const magic = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (new Date(magic.expiresAt) < new Date()) {
    await kv.del(`magic:${hashed}`);
    await auditLog(kv, 'magic_link_expired', { ip, ua });
    return Response.redirect(`${SITE_URL}/portal/login?error=expired`, 302);
  }

  // One-time use: delete immediately
  await kv.del(`magic:${hashed}`);

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

  return Response.redirect(`${SITE_URL}/portal`, {
    headers: { 'Set-Cookie': makeSessionCookie(sessionRaw) },
    status: 302,
  });
}
