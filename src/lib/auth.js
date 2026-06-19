import { createHash } from 'crypto';

const SESSION_TTL = 60 * 60 * 24 * 30;

export function hashToken(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

export async function getSession(request, kv) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)ev_session=([^;]+)/);
  if (!match) return null;
  const raw = decodeURIComponent(match[1]);
  const hash = hashToken(raw);
  try {
    const data = await kv.get(`session:${hash}`);
    if (!data) return null;
    const session = typeof data === 'string' ? JSON.parse(data) : data;
    if (new Date(session.expiresAt) < new Date()) { await kv.del(`session:${hash}`); return null; }
    return session;
  } catch { return null; }
}

export function makeSessionCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  return `ev_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/${isProd ? '; Secure' : ''}; Max-Age=${SESSION_TTL}`;
}

export function clearSessionCookie() {
  return `ev_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export async function auditLog(kv, event, data) {
  if (!kv) return;
  try {
    const key = `audit:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    await kv.set(key, JSON.stringify({ event, ...data, timestamp: new Date().toISOString() }), { ex: 60 * 60 * 24 * 90 });
  } catch {}
}
