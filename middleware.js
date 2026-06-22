// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // লগইন পেজ বাদ দিন
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // অ্যাডমিন পেজ চেক
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    
    // ✅ টোকেন নেই → লগইন পেজে পাঠান
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ শুধু টোকেন আছে কিনা চেক করুন (ভেরিফাই করবেন না)
    // Edge Runtime-এ crypto কাজ করে না
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};