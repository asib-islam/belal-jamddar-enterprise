import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // TODO: ডাটাবেজ থেকে ইউজার ডাটা আনা
    // ডেমো ডাটা
    return NextResponse.json({
      id: 1,
      name: 'Belal Jamddar',
      email: 'admin@belaljamddar.com',
      role: 'super_admin'
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Error' },
      { status: 500 }
    );
  }
}