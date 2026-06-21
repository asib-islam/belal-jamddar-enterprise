import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    const payload = verifySessionToken(session?.value);
    return NextResponse.json({ isAdmin: !!payload }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
