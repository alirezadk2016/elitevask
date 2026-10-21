import { NextResponse } from 'next/server';
import { clientIp } from '@/lib/clientIp';
import { checkBearer } from '@/lib/adminAuth';

const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /python-requests/i, /go-http-client/i, /curl\/[0-9]/i,
  /libwww/i, /wget/i, /scrapy/i, /phantomjs/i, /headlesschrome/i,
  /semrushbot/i, /ahrefsbot/i, /dotbot/i, /mj12bot/i,
];

const SUSPICIOUS_PATH_PATTERNS = [
  /\.(php|asp|aspx|jsp|cgi|pl|py|rb|sh|bash|env|git|svn|htaccess|htpasswd|xml|sql|bak|backup|old|tmp|log|conf|config|ini|yaml|yml|toml|lock)$/i,
  /wp-admin|wp-login|wp-content|wordpress|joomla|drupal/i,
  /\.\.\/|\.\.%2f|%2e%2e/i,
  /union.*select|select.*from|insert.*into|drop.*table/i,
  /<script|javascript:|vbscript:/i,
  /\/etc\/passwd|\/etc\/shadow|\/proc\//i,
  /phpmyadmin|adminer|webshell|c99|r57/i,
];

// Public files that must always be served (never treated as scanner probes)
const ALLOWED_PATHS = new Set(['/sitemap.xml', '/robots.txt', '/manifest.webmanifest']);

// Best-effort burst brake. This map is per serverless instance, so it is NOT a
// global limit — it only blunts a flood hitting one instance. The limits that
// actually matter (booking, login email) are KV-backed and global.
const ipHits = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS = 120;

function isRateLimited(ip) {
  const now = Date.now();
  const hits = ipHits.get(ip) || [];
  const recent = hits.filter(t => now - t < WINDOW_MS);
  recent.push(now);
  ipHits.set(ip, recent);
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (v.every(t => now - t > WINDOW_MS)) ipHits.delete(k);
    }
  }
  return recent.length > MAX_HITS;
}

/* Cross-site write guard.
 *
 * Every state-changing API route except one carries its own isSameOrigin()
 * check. The exception is /api/book — the most safety-critical file on the
 * site, which is deliberately left untouched — so a third-party page could
 * make a visitor's browser POST a real booking: slots blocked, confirmation
 * emails sent, no interaction from the victim. Enforcing it here closes that
 * without editing the route.
 *
 * The rule is deliberately narrow: reject only when an Origin/Referer is
 * PRESENT and points somewhere else. A request with no Origin at all is
 * passed through exactly as before, so nothing a real customer's browser or
 * an in-app webview does can start failing. Browsers always send Origin on a
 * cross-origin POST, which is the case this needs to catch.
 */
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SITE_ORIGINS = [
  'https://elite-vask.dk',
  'https://www.elite-vask.dk',
  'https://elitevask.vercel.app',
];

function isCrossSiteWrite(request) {
  if (!WRITE_METHODS.has(request.method)) return false;
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  let check = origin;
  if (!check && referer) { try { check = new URL(referer).origin; } catch { return false; } }
  if (!check || check === 'null') return false; // absent → unchanged behaviour
  if (SITE_ORIGINS.includes(check)) return false;
  if (check === request.nextUrl.origin) return false;
  const host = request.headers.get('host');
  if (host && (check === `https://${host}` || check === `http://${host}`)) return false;
  return true;
}

/* Admin brute-force lockout.
 *
 * The whole admin panel sits behind one shared secret, so guessing it must be
 * slow. Every /api/admin* request that carries an Authorization header with
 * the WRONG secret counts as a failed attempt for that IP (KV-backed, so it is
 * global across serverless instances). After ADMIN_MAX_FAILS within the
 * window the IP is refused outright for the rest of the window — even with the
 * right secret, otherwise the lockout would just be an oracle. A correct
 * secret never adds to the counter. If KV is unreachable the check is skipped
 * (fail-open) so the owner can never be locked out by an outage.
 */
const ADMIN_MAX_FAILS = 10;
const ADMIN_WINDOW_S = 15 * 60;
let lockKv = null;
async function getLockKv() {
  if (lockKv) return lockKv;
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import('@upstash/redis');
  lockKv = new Redis({ url, token });
  return lockKv;
}
async function adminLockout(request, ip) {
  const auth = request.headers.get('authorization');
  if (!auth) return null; // no credentials → the route itself answers 401
  try {
    const kv = await getLockKv();
    if (!kv) return null;
    const key = `admlock:${ip}`;
    const fails = Number(await kv.get(key)) || 0;
    const tooMany = () => new NextResponse(
      JSON.stringify({ error: 'locked', message: 'For mange forkerte login-forsøg. Prøv igen om 15 minutter.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(ADMIN_WINDOW_S) } }
    );
    if (fails >= ADMIN_MAX_FAILS) return tooMany();
    if (!checkBearer(request)) {
      const n = await kv.incr(key);
      if (n === 1) await kv.expire(key, ADMIN_WINDOW_S);
      if (n >= ADMIN_MAX_FAILS) return tooMany();
    }
  } catch {}
  return null;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const ip = clientIp(request);

  // Block suspicious user agents on API routes
  if (pathname.startsWith('/api/')) {
    for (const pattern of BLOCKED_UA_PATTERNS) {
      if (pattern.test(ua)) {
        return new NextResponse(null, { status: 403 });
      }
    }
  }

  // Block suspicious paths (vulnerability scanners) — but never block known
  // public metadata files (the .xml rule otherwise 404s the real /sitemap.xml).
  if (!ALLOWED_PATHS.has(pathname)) {
    for (const pattern of SUSPICIOUS_PATH_PATTERNS) {
      if (pattern.test(pathname)) {
        return new NextResponse(null, { status: 404 });
      }
    }
  }

  // Block empty user-agent on API routes
  if (pathname.startsWith('/api/') && !ua) {
    return new NextResponse(null, { status: 403 });
  }

  if (pathname.startsWith('/api/') && isCrossSiteWrite(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'forbidden', message: 'Cross-site request blocked.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Global rate limit per IP (120 req/min)
  if (isRateLimited(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'rate_limit', message: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  if (pathname.startsWith('/api/admin')) {
    const locked = await adminLockout(request, ip);
    if (locked) return locked;
  }

  // Portal auth guard
  const cookie = request.headers.get('cookie') || '';
  const hasSession = /(?:^|;\s*)ev_session=/.test(cookie);
  if (pathname.startsWith('/portal') && !pathname.startsWith('/portal/login') && !pathname.startsWith('/portal/verify')) {
    if (!hasSession) {
      const url = new URL('/portal/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Request-ID', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|mp4|webm)).*)',
  ],
};
