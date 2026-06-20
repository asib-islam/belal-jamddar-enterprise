import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}