// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware - Path:', pathname);

  // লগইন পেজ বাদ দিন
  if (pathname === '/admin/login') {
    console.log('🔍 Middleware - Login page, allowing access');
    return NextResponse.next();
  }

  // অ্যাডমিন পেজ চেক
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    
    console.log('🔍 Middleware - Token exists:', !!token);
    
    // ✅ টোকেন নেই → লগইন পেজে পাঠান
    if (!token) {
      console.log('❌ Middleware - No token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ টোকেন আছে → চলতে দিন
    console.log('✅ Middleware - Token found, allowing access');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};