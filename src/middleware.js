import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.headers.get('cookie') || '';
  const hasSession = /(?:^|;\s*)ev_session=/.test(cookie);

  if (pathname.startsWith('/portal') && !pathname.startsWith('/portal/login')) {
    if (!hasSession) {
      const url = new URL('/portal/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/portal/:path*'] };
