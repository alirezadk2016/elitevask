// Protected diagnostics endpoint — checks all required env vars and connections
export async function GET(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 });
  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const results = {};

  // SMTP
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'send.one.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  results.smtp = {
    SMTP_USER: smtpUser || '❌ NOT SET',
    SMTP_PASS: smtpPass ? `✅ set (${smtpPass.length} chars)` : '❌ NOT SET',
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    sender_expected: 'booking@elite-vask.dk',
    sender_ok: smtpUser === 'booking@elite-vask.dk' ? '✅' : `⚠️ got: ${smtpUser}`,
  };

  // KV / Redis
  const kvUrl   = process.env.KV_REST_API_URL   || process.env.STORAGE_KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN  || process.env.STORAGE_KV_REST_API_TOKEN;
  results.kv = {
    KV_REST_API_URL:   kvUrl   ? `✅ set (${kvUrl.slice(0, 30)}...)` : '❌ NOT SET',
    KV_REST_API_TOKEN: kvToken ? `✅ set (${kvToken.length} chars)`  : '❌ NOT SET',
  };

  if (kvUrl && kvToken) {
    try {
      const { Redis } = await import('@upstash/redis');
      const kv = new Redis({ url: kvUrl, token: kvToken });
      await kv.set('health:ping', '1', { ex: 10 });
      const val = await kv.get('health:ping');
      results.kv.connection = val === '1' ? '✅ read/write OK' : '❌ write OK but read failed';
    } catch (e) {
      results.kv.connection = `❌ failed: ${e.message}`;
    }
  } else {
    results.kv.connection = '❌ skipped — credentials missing';
  }

  // Test SMTP (no email sent — just auth handshake)
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      const t = nodemailer.default.createTransport({
        host: smtpHost, port: smtpPort, secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await t.verify();
      results.smtp.connection = '✅ SMTP authenticated OK';
    } catch (e) {
      results.smtp.connection = `❌ SMTP failed: ${e.message}`;
    }
  } else {
    results.smtp.connection = '❌ skipped — credentials missing';
  }

  // Env check
  results.admin = { ADMIN_SECRET: `✅ set (${secret.length} chars)` };
  results.site  = { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '⚠️ not set (will derive from request)' };

  return Response.json(results, { status: 200 });
}
