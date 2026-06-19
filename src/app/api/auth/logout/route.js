import { hashToken, clearSessionCookie } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';

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

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)ev_session=([^;]+)/);
  if (match) {
    const raw = decodeURIComponent(match[1]);
    const kv = await getKV();
    if (kv) { try { await kv.del(`session:${hashToken(raw)}`); } catch {} }
  }
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}
