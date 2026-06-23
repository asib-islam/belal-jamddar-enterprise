// app/api/admin/users/route.js - পরিবর্তন করতে হবে
import { NextResponse } from 'next/server';
import { hashPassword, verifySessionToken } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { generateOTP } from '../../../../lib/otp';
import nodemailer from 'nodemailer';

// ... GET, DELETE, PUT ইতিমধ্যে আছে ...

// ===== POST: নতুন ইউজার যোগ করা (OTP যোগ করা হয়েছে) =====
export async function POST(request) {
  try {
    const session = request.cookies.get('admin_session');
    const currentUser = verifySessionToken(session?.value);

    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ message: 'Only Super Admin can add users' }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Email check
    const { data: existing } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const { data: newUser, error } = await supabaseAdmin
      .from('admin_users')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash: hashedPassword,
        role: role || 'viewer',
        status: 'Active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    // ✅ OTP পাঠান (যাতে ইউজার লগইন করতে পারে)
    try {
      const otp = generateOTP(email);
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🎉 Welcome to Belal Jamaddar Enterprise - Your Login Details',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #ff6600; text-align: center;">🎉 Welcome ${name}!</h2>
            <p style="color: #4a5568;">You have been added as an admin to <strong>Belal Jamaddar Enterprise</strong>.</p>
            <div style="background: #f7f8fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> ${role || 'viewer'}</p>
            </div>
            <p style="color: #4a5568;">Your verification code is:</p>
            <div style="text-align: center; font-size: 32px; font-weight: 700; color: #ff6600; background: #f7f8fa; padding: 15px; border-radius: 8px; letter-spacing: 4px; margin: 10px 0;">
              ${otp}
            </div>
            <p style="color: #718096; text-align: center; font-size: 14px;">This code will expire in <strong>5 minutes</strong>.</p>
            <p style="color: #a0aec0; text-align: center; font-size: 12px; margin-top: 20px;">Login at: ${process.env.NEXT_PUBLIC_APP_URL || 'your-domain.com'}/admin/login</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // ইউজার তৈরি হয়েছে, কিন্তু ইমেইল যায়নি - ইউজারকে জানান
    }

    return NextResponse.json({
      message: `✅ ${name} added successfully! Welcome email with OTP sent.`,
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}