import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    const isAdmin = verifySessionToken(session?.value);
    return NextResponse.json({ isAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
