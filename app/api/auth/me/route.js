import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    const payload = verifySessionToken(session?.value);

    if (!payload) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
