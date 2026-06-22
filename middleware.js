// middleware.js
import { NextResponse } from 'next/server';
import { verifySessionToken } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware - Path:', pathname);
  console.log('🔍 Middleware - All cookies:', request.cookies.getAll());

  // লগইন পেজ বাদ দিন
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // অ্যাডমিন পেজ চেক
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    
    console.log('🔍 Middleware - Token exists:', !!token);
    if (token) {
      console.log('🔍 Middleware - Token value:', token.substring(0, 20) + '...');
    }
    
    // ✅ টোকেন নেই → লগইন পেজে পাঠান
    if (!token) {
      console.log('❌ Middleware - No token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ টোকেন ভ্যালিড কিনা চেক করুন
    const payload = verifySessionToken(token);
    if (!payload) {
      console.log('❌ Middleware - Invalid token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_session');
      return response;
    }

    console.log('✅ Middleware - Valid token for:', payload.email);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};