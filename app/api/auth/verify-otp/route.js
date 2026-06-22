// app/api/auth/verify-otp/route.js
import { NextResponse } from 'next/server';
import { verifyOTP } from '../../../../lib/otp';
import { createSessionToken } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP required' }, { status: 400 });
    }
    
    // OTP ভেরিফাই
    const result = verifyOTP(email, otp);
    
    if (!result.valid) {
      return NextResponse.json({ message: result.message }, { status: 401 });
    }
    
    // ইউজার ডাটা আনা
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // সেশন টোকেন তৈরি
    const token = createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    const response = NextResponse.json({ 
      message: 'OTP verified successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, { status: 200 });
    
    // মূল সেশন কুকি সেট
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
    
    // টেম্পোরারি সেশন ডিলিট
    response.cookies.delete('login_session');
    
    return response;
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}