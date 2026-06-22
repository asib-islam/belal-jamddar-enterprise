// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware - Path:', pathname);

  // ===== পাবলিক পেজ (সবার জন্য খোলা) =====
  const publicPaths = ['/admin/login', '/admin/verify-otp'];
  if (publicPaths.includes(pathname)) {
    console.log('🔍 Middleware - Public path, allowing access');
    return NextResponse.next();
  }

  // ===== অ্যাডমিন পেজ চেক =====
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    const loginSession = request.cookies.get('login_session')?.value;
    
    console.log('🔍 Middleware - Token exists:', !!token);
    console.log('🔍 Middleware - Login session exists:', !!loginSession);

    // ✅ admin_session থাকলে → ড্যাশবোর্ড দেখাবে
    if (token) {
      console.log('✅ Middleware - Valid token, allowing access');
      return NextResponse.next();
    }

    // ✅ login_session থাকলে → OTP পেজে পাঠান
    if (loginSession) {
      console.log('🔄 Middleware - Login session found, redirecting to OTP');
      return NextResponse.redirect(new URL('/admin/verify-otp', request.url));
    }

    // ❌ কিছুই না থাকলে → লগইন পেজে পাঠান
    console.log('❌ Middleware - No session, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};