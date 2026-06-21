'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);

  // ===== পারমিশন চেক =====
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          const permissions = data.user.permissions || [];
          const canEdit = permissions.includes('edit_product') || 
                          permissions.includes('all') || 
                          data.user.role === 'Super Admin';
          setHasPermission(canEdit);
          if (!canEdit) {
            alert('❌ You do not have permission to edit products!');
            router.push('/admin/dashboard');
          }
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/admin/login');
      } finally {
        setChecking(false);
      }
    };
    checkPermission();
  }, [router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const product = data.find(p => p.id === parseInt(id));
        if (product) {
          setTitle(product.title || '');
          setDescription(product.description || '');
          setPrice(product.price?.toString() || '');
          setImageUrls(product.images || [product.image || '']);
          setCategory(product.category || '');
        } else {
          alert('Product not found!');
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error loading product');
        router.push('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (hasPermission) {
      fetchProduct();
    }
  }, [id, router, hasPermission]);

  const addImageField = () => {
    if (imageUrls.length < 10) setImageUrls([...imageUrls, '']);
  };

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
        body: JSON.stringify({
          id: parseInt(id),
          title,
          description,
          price,
          images: validImages,
          category
        }),
      });

      if (res.ok) {
        alert('✅ Product updated!');
        router.push('/admin/dashboard');
      } else {
        const error = await res.json();
        alert('❌ Error: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Server error');
    } finally {
      setSaving(false);
    }
  };

  if (checking || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <button
        onClick={() => router.push('/admin/dashboard')}
        style={{ marginBottom: '20px', padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        ← Back to Dashboard
      </button>

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
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Electronics, Fashion" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
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
