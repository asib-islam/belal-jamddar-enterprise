// app/api/auth/check-session/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const loginSession = request.cookies.get('login_session');
    const adminSession = request.cookies.get('admin_session');
    
    // যদি admin_session থাকে, তাহলে ইতিমধ্যে লগইন করা
    if (adminSession) {
      return NextResponse.json({ 
        email: null, 
        message: 'Already logged in',
        redirect: '/admin/dashboard'
      }, { status: 200 });
    }
    
    // login_session থেকে email বের করা
    const email = loginSession?.value || null;
    
    if (!email) {
      return NextResponse.json({ 
        email: null, 
        message: 'No login session found' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      email: email,
      message: 'Login session found' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Check session error:', error);
    return NextResponse.json({ 
      email: null, 
      message: 'Server error' 
    }, { status: 500 });
  }
}