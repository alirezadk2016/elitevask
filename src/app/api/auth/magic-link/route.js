import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { hashToken, auditLog } from '@/lib/auth';

const COMPANY_EMAIL = 'elitevask01@gmail.com';
const SITE_URL = 'https://elitevask.vercel.app';
const MAGIC_TTL = 60 * 15;

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

async function checkRL(kv, key, max, window) {
  if (!kv) return true;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, window);
    return count <= max;
  } catch { return true; }
}

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ua = request.headers.get('user-agent') || '';

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body.email || '').toLowerCase().trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'invalid_email', message: 'Ugyldig e-mailadresse.' }, { status: 400 });
  }

  const kv = await getKV();

  const emailOk = await checkRL(kv, `rl:magic:email:${hashToken(email)}`, 3, 3600);
  const ipOk = await checkRL(kv, `rl:magic:ip:${ip}`, 8, 3600);
  if (!emailOk || !ipOk) {
    await auditLog(kv, 'magic_link_rate_limited', { emailHash: hashToken(email), ip });
    return Response.json({ error: 'rate_limit', message: 'For mange anmodninger. Prøv igen om en time.' }, { status: 429 });
  }

  const rawToken = randomBytes(32).toString('hex');
  const hashed = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + MAGIC_TTL * 1000).toISOString();

  if (kv) {
    await kv.set(`magic:${hashed}`, JSON.stringify({ email, expiresAt }), { ex: MAGIC_TTL });
  }

  await auditLog(kv, 'magic_link_requested', { emailHash: hashToken(email), ip, ua });

  const link = `${SITE_URL}/api/auth/verify?token=${rawToken}`;
  const transport = buildTransport();

  if (transport) {
    try {
      await transport.sendMail({
        from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: email,
        subject: 'Din loginlink til Elite Vask',
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0b1310;color:#e9f1ec;border-radius:16px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#15211b;border-radius:50%;padding:16px;margin-bottom:12px">
              <span style="font-size:32px">🔑</span>
            </div>
            <h2 style="color:#37d278;margin:0;font-size:22px">Log ind på Elite Vask</h2>
          </div>
          <p style="color:#94a89c;margin-bottom:24px;text-align:center">Klik på knappen nedenfor for at logge ind i din kundeprofil. Linket er gyldigt i <strong style="color:#fff">15 minutter</strong> og kan kun bruges én gang.</p>
          <div style="text-align:center;margin-bottom:28px">
            <a href="${link}" style="display:inline-block;background:#37d278;color:#062313;padding:15px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px">Log ind nu →</a>
          </div>
          <div style="background:#15211b;border-radius:8px;padding:14px 16px;margin-bottom:20px">
            <p style="font-size:12px;color:#6f857a;margin:0">⚠️ Har du ikke bedt om dette link? Ignorer blot denne e-mail. Linket udløber automatisk.</p>
          </div>
          <hr style="border:none;border-top:1px solid #1b2a22;margin:0 0 16px">
          <p style="font-size:11px;color:#6f857a;text-align:center;margin:0">Elite Vask · elitevask01@gmail.com · +45 24 44 03 21</p>
        </div>`,
      });
    } catch (err) {
      console.error('Magic link email error:', err.message);
      return Response.json({ error: 'email_failed' }, { status: 500 });
    }
  } else {
    console.log(`[magic-link] No SMTP. Link: ${link}`);
  }

  return Response.json({ ok: true });
}
