import { NextResponse } from 'next/server';

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

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  // Block suspicious user agents on API routes
  if (pathname.startsWith('/api/')) {
    for (const pattern of BLOCKED_UA_PATTERNS) {
      if (pattern.test(ua)) {
        return new NextResponse(null, { status: 403 });
      }
    }
  }

  // Block suspicious paths (vulnerability scanners)
  for (const pattern of SUSPICIOUS_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Block empty user-agent on API routes
  if (pathname.startsWith('/api/') && !ua) {
    return new NextResponse(null, { status: 403 });
  }

  // Global rate limit per IP (120 req/min)
  if (isRateLimited(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'rate_limit', message: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  // Portal auth guard
  const cookie = request.headers.get('cookie') || '';
  const hasSession = /(?:^|;\s*)ev_session=/.test(cookie);
  if (pathname.startsWith('/portal') && !pathname.startsWith('/portal/login')) {
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
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg|hero.jpg.png|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)).*)',
  ],
};
