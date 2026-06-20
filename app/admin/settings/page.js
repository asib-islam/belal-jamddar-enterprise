'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    storeName: 'Belal Jamddar Enterprise',
    storeEmail: 'belaljamddar@gmail.com',
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
      alert('✅ Settings saved successfully!');
      setSaving(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px' }}>⚙️ Store Settings</h1>
        <button onClick={() => router.push('/admin/dashboard')} style={{ padding: '10px 20px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gap: '15px' }}>
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
        </div>

        <button type="submit" disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#cbd5e1' : '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '16px', marginTop: '20px', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '⏳ Saving...' : '💾 Save Settings'}
        </button>
      </form>
    </div>
  );
}