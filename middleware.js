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
    
    console.log('🔍 Middleware check:', pathname, 'Token:', !!token);
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};