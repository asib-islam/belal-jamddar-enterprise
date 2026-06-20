import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    
    // চেক করা ইউজার অ্যাডমিন কিনা
    const isAdmin = session && session.value === 'authenticated';
    
    return NextResponse.json({ isAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}