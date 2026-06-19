import { createHash } from 'crypto';

// One-time migration: index all existing booking:* records under user:bookings:{emailHash}
// Protected by ADMIN_SECRET env var. Run once after deploying the customer portal.

function hashEmail(email) {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

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
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 });

  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'no_kv' }, { status: 503 });

  let cursor = 0;
  let indexed = 0;
  let skipped = 0;
  let errors = 0;

  do {
    let result;
    try {
      result = await kv.scan(cursor, { match: 'booking:*', count: 100 });
    } catch (e) {
      return Response.json({ error: 'scan_failed', detail: e.message }, { status: 500 });
    }

    cursor = result[0];
    const keys = result[1];

    for (const key of keys) {
      try {
        const raw = await kv.get(key);
        if (!raw) { skipped++; continue; }
        const b = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!b.email) { skipped++; continue; }

        const token = key.replace(/^booking:/, '');
        const emailHash = hashEmail(b.email);
        await kv.sadd(`user:bookings:${emailHash}`, token);
        indexed++;
      } catch {
        errors++;
      }
    }
  } while (cursor !== 0);

  return Response.json({ ok: true, indexed, skipped, errors });
}
