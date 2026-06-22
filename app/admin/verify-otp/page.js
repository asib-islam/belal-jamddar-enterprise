'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/check-session');
        const data = await res.json();
        if (!data.email) {
          router.push('/admin/login');
        } else {
          setEmail(data.email);
        }
      } catch (error) {
        router.push('/admin/login');
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setTimeLeft(300);
        setError('');
        alert('New OTP sent to your email!');
      } else {
        setError('Failed to resend OTP');
      }
    } catch (error) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f7f8fa',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>🔐 Verify OTP</h2>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            We sent a code to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '15px', color: '#4a5568', fontSize: '14px' }}>
          ⏱️ Time remaining: <strong>{formatTime(timeLeft)}</strong>
        </div>

        <form onSubmit={handleVerifyOTP}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g., 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '20px',
                textAlign: 'center',
                letterSpacing: '8px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft <= 0}
            style={{
              width: '100%',
              padding: '14px',
              background: (loading || timeLeft <= 0) ? '#cbd5e1' : '#ff6600',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: (loading || timeLeft <= 0) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Verifying...' : '✅ Verify & Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={handleResendOTP}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6600',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🔄 Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}