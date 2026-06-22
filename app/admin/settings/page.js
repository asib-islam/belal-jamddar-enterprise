'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../../components/AdminNav';

export default function Settings() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  // ===== AUTH CHECK =====
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setUser(await res.json());
        } else {
          router.replace('/admin/login');
        }
      } catch (error) {
        router.replace('/admin/login');
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router]);

  // ===== ACCOUNT SECURITY (Real - password/email change) =====
  const [account, setAccount] = useState({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
  const [accountSaving, setAccountSaving] = useState(false);

  const handleAccountChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    if (!account.currentPassword) {
      alert('Current password দিতে হবে!');
      return;
    }
    if (account.newPassword && account.newPassword !== account.confirmPassword) {
      alert('New password আর Confirm password মিলছে না!');
      return;
    }
    if (!account.newEmail && !account.newPassword) {
      alert('নতুন email বা password অন্তত একটা দিন!');
      return;
    }

    setAccountSaving(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: account.currentPassword,
          newEmail: account.newEmail || undefined,
          newPassword: account.newPassword || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ ' + data.message);
        // email/password change holo - purono session ar valid na, abar
        // notun credential diye login korte hobe
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
      } else {
        alert('❌ ' + (data.message || 'Update failed'));
      }
    } catch (error) {
      alert('❌ Server error');
    } finally {
      setAccountSaving(false);
    }
  };

  // ===== STORE INFO (UI-only, ekhono database e save hoy na) =====
  const [settings, setSettings] = useState({
    storeName: 'Belal Jamaddar Enterprise',
    storeEmail: 'belaljamaddarenterprise@gmail.com',
    storePhone: '01581427849',
    storeAddress: 'Your Store Address',
    currency: 'BDT',
    whatsappNumber: '01581427849'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert('✅ Settings saved successfully! (এই অংশটা এখনো demo - ডাটাবেজে সেভ হয় না)');
      setSaving(false);
    }, 1000);
  };

  if (!authChecked || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p>Checking access...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

      <AdminNav user={user} active="/admin/settings" />

      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>⚙️ Settings</h1>

      {/* ===== ACCOUNT SECURITY ===== */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>🔐 Account Security</h2>
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
          আপনার login email বা password পরিবর্তন করুন। verify করার জন্য current password দিতে হবে।
        </p>

        <form onSubmit={handleAccountSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
              Current Password <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              placeholder="বর্তমান password দিন"
              value={account.currentPassword}
              onChange={handleAccountChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>New Email (ঐচ্ছিক)</label>
            <input
              type="email"
              name="newEmail"
              placeholder={user.email}
              value={account.newEmail}
              onChange={handleAccountChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
            <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>বর্তমান: {user.email}</p>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>New Password (ঐচ্ছিক)</label>
            <input
              type="password"
              name="newPassword"
              placeholder="কমপক্ষে ৮ ক্যারেক্টার"
              value={account.newPassword}
              onChange={handleAccountChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          {account.newPassword && (
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="আবার লিখুন"
                value={account.confirmPassword}
                onChange={handleAccountChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={accountSaving}
            style={{ padding: '14px', background: accountSaving ? '#cbd5e1' : '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: accountSaving ? 'not-allowed' : 'pointer' }}
          >
            {accountSaving ? '⏳ Updating...' : '🔐 Update Account'}
          </button>
        </form>
      </div>

      {/* ===== STORE INFO ===== */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>🏪 Store Information</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Store Name</label>
            <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Store Email</label>
            <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Store Phone</label>
            <input type="text" name="storePhone" value={settings.storePhone} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Store Address</label>
            <input type="text" name="storeAddress" value={settings.storeAddress} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>WhatsApp Number</label>
            <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Currency</label>
            <input type="text" name="currency" value={settings.currency} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <button type="submit" disabled={saving} style={{ padding: '14px', background: saving ? '#cbd5e1' : '#4299e1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '⏳ Saving...' : '💾 Save Store Info'}
          </button>
        </form>
      </div>
    </div>
  );
}
