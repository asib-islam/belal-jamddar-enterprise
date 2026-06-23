// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    const user = verifySessionToken(session?.value);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}