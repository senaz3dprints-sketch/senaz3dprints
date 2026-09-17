import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_AUTH_SECRET || 'senaz_3d_prints_super_secret_admin_jwt_key_2026'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check API Admin Routes Security
  if (pathname.startsWith('/api/admin')) {
    // Whitelist login and logout API endpoints
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return NextResponse.next();
    }

    const token =
      request.cookies.get('senaz_admin_session')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session token is missing.' },
        { status: 401 }
      );
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      if (verified.payload && verified.payload.role === 'ADMIN') {
        return NextResponse.next();
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or expired admin session token.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Forbidden. Admin privileges required.' },
      { status: 403 }
    );
  }

  // 2. Check Admin Frontend Dashboard Routes Security
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('senaz_admin_session')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      if (verified.payload && verified.payload.role === 'ADMIN') {
        return NextResponse.next();
      }
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Add security response headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

