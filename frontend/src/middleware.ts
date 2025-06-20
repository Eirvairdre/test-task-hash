import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('session_token');
  const isAuthPage = request.nextUrl.pathname === '/login';

  // Неавторизованный доступ к защищенной странице
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Авторизованный доступ к странице входа
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/hash', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/hash', '/admin/:path*'],
}; 