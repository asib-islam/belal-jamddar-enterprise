import { NextResponse } from 'next/server';

// Eta "first line of defense" - kono page render howar AGE-i, server theke
// check kore "admin_session" cookie ache kina. Na thakle shoja
// /admin/login e pathiye dey - mane URL-e jekono /admin/* page type korlei
// ar kichu dekha jabe na, redirect hoye jabe.
//
// NOTE: signature/role-er pura verify ekhane hocche na (Edge runtime e
// Node-er crypto module reliable na), oita hocche:
//   1) protected page gulor client-side "/api/auth/me" check e
//   2) prottek API route (products, admin/users, admin/account) er nijer
//      moddhe (verifySessionToken diye)
// Tai middleware miss korle o asol data (products add/edit/delete, user
// management) API level e thik-i protected thake.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // login page nijeke protect kora lagbe na (nahole loop hobe)
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
