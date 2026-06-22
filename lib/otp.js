// lib/otp.js
import crypto from 'crypto';

// OTP স্টোর (প্রোডাকশনে Redis বা Database ব্যবহার করুন)
const otpStore = new Map();

// ===== ৬ ডিজিটের OTP জেনারেট =====
export function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // ৫ মিনিট
  
  // পুরনো OTP ডিলিট
  otpStore.delete(email);
  
  // নতুন OTP সংরক্ষণ
  otpStore.set(email, { otp, expiresAt });
  
  return otp;
}

// ===== OTP ভেরিফাই =====
export function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  
  if (!record) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (record.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // সফল হলে OTP ডিলিট
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified successfully' };
}

// ===== OTP রিসেট (ঐচ্ছিক) =====
export function clearOTP(email) {
  otpStore.delete(email);
}