import { randomBytes } from 'crypto';
import { hashToken, auditLog } from '@/lib/auth';
import { buildTransport, emailShell, BOOKING_EMAIL, INFO_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

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
  const ipOk    = await checkRL(kv, `rl:magic:ip:${ip}`, 8, 3600);
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

  const reqUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${reqUrl.protocol}//${reqUrl.host}`;
  const link = `${siteUrl}/api/auth/verify?token=${rawToken}`;
  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;
  const transport = buildTransport();

  if (transport) {
    try {
      await transport.sendMail({
        from: `"Elite Vask" <${senderUser}>`,
        to: email,
        replyTo: CONTACT_EMAIL,
        subject: 'Din loginlink til Elite Vask',
        html: emailShell({
          title: '🔑 Log ind på Elite Vask',
          preheader: 'Klik på linket for at logge ind. Gyldigt i 15 minutter.',
          lang: 'da',
          body: `
            <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 24px;text-align:center">
              Klik på knappen nedenfor for at logge ind i din kundeprofil.<br>
              Linket er gyldigt i <strong>15 minutter</strong> og kan kun bruges én gang.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <tr><td align="center">
                <a href="${link}" style="display:inline-block;background:#0d4a25;color:#ffffff;padding:15px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
                  Log ind nu →
                </a>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
              <tr><td style="background:#fdf8ec;border:1px solid #f0e0a0;border-radius:8px;padding:14px 18px">
                <p style="margin:0;font-size:13px;color:#7a6520;line-height:1.5">
                  ⚠️ <strong>Har du ikke bedt om dette link?</strong> Ignorer blot denne e-mail. Linket udløber automatisk og kan ikke misbruges.
                </p>
              </td></tr>
            </table>
            <p style="font-size:12px;color:#aaa;margin:0;text-align:center;line-height:1.6">
              Kan du ikke klikke på knappen? Kopier dette link til din browser:<br>
              <a href="${link}" style="color:#0d4a25;word-break:break-all">${link}</a>
            </p>
          `,
        }),
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
