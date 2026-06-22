import { NextResponse } from 'next/server';
import { createSessionToken, comparePassword } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Login attempt:', email); // ডিবাগging

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('status', 'Active')
      .single();

    console.log('👤 User found:', user?.email); // ডিবাগging

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password_hash);
    console.log('🔑 Password valid:', valid); // ডিবাগging

    if (!valid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    console.log('✅ Token created'); // ডিবাগging

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, { status: 200 });
    
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    console.log('🍪 Cookie set'); // ডিবাগging

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}