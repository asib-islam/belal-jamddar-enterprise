import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    console.log('🔍 Me - Token from cookie:', token ? 'YES' : 'NO');
    console.log('🔍 Me - Token value:', token?.substring(0, 30) + '...');

    const payload = verifySessionToken(token);
    console.log('👤 Me - Verified payload:', payload);

    if (!payload) {
      console.log('❌ Me - No payload, sending 401');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    console.log('✅ Me - Returning user:', payload);
    return NextResponse.json({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Me - Error:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}