// app/api/auth/send-otp/route.js
import { NextResponse } from 'next/server';
import { generateOTP } from '../../../../lib/otp';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    
    // OTP জেনারেট
    const otp = generateOTP(email);
    
    // ইমেইল কনফিগারেশন
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // ইমেইল পাঠান
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Login Verification Code - Belal Jamddar Enterprise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ff6600; text-align: center;">🔐 Login Verification</h2>
          <p style="color: #4a5568; text-align: center;">Your verification code is:</p>
          <div style="text-align: center; font-size: 36px; font-weight: 700; color: #ff6600; background: #f7f8fa; padding: 15px; border-radius: 8px; letter-spacing: 4px; margin: 10px 0;">
            ${otp}
          </div>
          <p style="color: #718096; text-align: center; font-size: 14px;">This code will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #a0aec0; text-align: center; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    
    return NextResponse.json({ 
      message: 'OTP sent successfully', 
      email 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ 
      message: 'Failed to send OTP. Please try again.' 
    }, { status: 500 });
  }
}