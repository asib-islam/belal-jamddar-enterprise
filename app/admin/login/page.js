'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
<<<<<<< HEAD
        // ✅ লগইন সফল
        window.location.href = '/admin/dashboard'; // সরাসরি redirect
=======
        // ✅ লগইন সফল → ড্যাশবোর্ডে যান
        router.push('/admin/dashboard');
        router.refresh(); // পেজ রিফ্রেশ করুন
>>>>>>> 784a7ff73c675aa74ddc0852906d004742f6c2fa
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f7f8fa', padding: '20px' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Admin Login</h2>
        </div>

        {error && (
          <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '15px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '15px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#cbd5e1' : '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Logging in...' : '🔐 Login'}
        </button>
      </form>
    </div>
  );
}