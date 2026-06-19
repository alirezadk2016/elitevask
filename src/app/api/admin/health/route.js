// Protected diagnostics endpoint — checks all required env vars and connections
export async function GET(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 });
  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const results = {};

  // GMAIL
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;
  results.gmail = {
    GMAIL_USER: gmailUser || '❌ NOT SET',
    GMAIL_PASS: gmailPass ? `✅ set (${gmailPass.length} chars)` : '❌ NOT SET',
    sender_correct: (gmailUser === 'booking@elite-vask.dk' || gmailUser === 'elitevask01@gmail.com') ? '✅ correct' : `❌ unexpected — got: ${gmailUser}`,
  };

  // KV / Redis
  const kvUrl = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
  results.kv = {
    KV_REST_API_URL: kvUrl ? `✅ set (${kvUrl.slice(0, 30)}...)` : '❌ NOT SET',
    KV_REST_API_TOKEN: kvToken ? `✅ set (${kvToken.length} chars)` : '❌ NOT SET',
  };

  // Test actual Redis connection
  if (kvUrl && kvToken) {
    try {
      const { Redis } = await import('@upstash/redis');
      const kv = new Redis({ url: kvUrl, token: kvToken });
      await kv.set('health:ping', '1', { ex: 10 });
      const val = await kv.get('health:ping');
      results.kv.connection = val === '1' ? '✅ connected and read/write OK' : '❌ write OK but read failed';
    } catch (e) {
      results.kv.connection = `❌ connection failed: ${e.message}`;
    }
  } else {
    results.kv.connection = '❌ skipped — credentials missing';
  }

  // Test SMTP connection (no email sent)
  if (gmailUser && gmailPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transport = nodemailer.default.createTransport({
        host: 'smtp.gmail.com', port: 465, secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transport.verify();
      results.gmail.smtp_connection = '✅ SMTP authenticated OK';
    } catch (e) {
      results.gmail.smtp_connection = `❌ SMTP failed: ${e.message}`;
    }
  } else {
    results.gmail.smtp_connection = '❌ skipped — credentials missing';
  }

  // ADMIN_SECRET
  results.admin = {
    ADMIN_SECRET: `✅ set (${secret.length} chars)`,
  };

  return Response.json(results, { status: 200 });
}
