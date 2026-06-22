// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { comparePassword } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('status', 'Active')
      .single();

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // ===== ইমেইল+পাস সঠিক → OTP পাঠান =====
    // OTP ইমেইল পাঠানোর জন্য আলাদা কল হবে
    
    // ইউজার ডাটা সংরক্ষণ (OTP ভেরিফাইয়ের জন্য)
    const response = NextResponse.json({ 
      message: 'Login successful. Please verify OTP.',
      requiresOTP: true,
      email: user.email
    }, { status: 200 });
    
    // টেম্পোরারি সেশন (OTP ভেরিফাই না হলে লগইন হবে না)
    response.cookies.set('login_session', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60, // ৫ মিনিট
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}