'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNav from '../../../../components/AdminNav';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const product = data.find(p => p.id === parseInt(id));
        if (product) {
          setTitle(product.title || '');
          setDescription(product.description || '');
          setPrice(product.price || '');
          setImageUrls(product.images || [product.image || '']);
          setCategory(product.category || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const addImageField = () => setImageUrls([...imageUrls, '']);
  const removeImageField = (index) => {
    if (imageUrls.length <= 1) return;
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const validImages = imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      alert('Add at least one image!');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id), title, description, price, images: validImages, category }),
      });

      if (res.ok) {
        alert('✅ Product updated!');
        router.push('/admin/dashboard');
      } else {
        const err = await res.json();
        alert('❌ ' + (err.message || 'Error updating product'));
      }
    } catch (error) {
      alert('❌ Server error');
    } finally {
      setSaving(false);
    }
  };

  if (!authChecked || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p>Checking access...</p>
      </div>
    );
  }

  if (user.role === 'viewer') {
    return (
      <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
        <AdminNav user={user} active="/admin/dashboard" />
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '50px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ color: '#e53e3e', marginBottom: '8px' }}>Access Denied</h2>
          <p style={{ color: '#718096' }}>Your role (<strong>{user.role}</strong>) doesn't have permission to edit products.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>

      <AdminNav user={user} active="/admin/dashboard" />

      <h2 style={{ fontSize: '24px', marginBottom: '25px' }}>✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Title *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Description *</label>
          <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Price (BDT) *</label>
          <input type="text" required value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Electronics, Fashion, etc." style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Images *</label>
          {imageUrls.map((url, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input type="url" required placeholder={`Image ${i + 1}`} value={url} onChange={(e) => updateImageUrl(i, e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <button type="button" onClick={() => removeImageField(i)} style={{ padding: '8px 14px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={addImageField} style={{ padding: '10px 20px', background: '#48bb78', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Image</button>
        </div>

        <button type="submit" disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#cbd5e1' : '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '⏳ Saving...' : '💾 Update Product'}
        </button>
      </form>
    </div>
  );
}
