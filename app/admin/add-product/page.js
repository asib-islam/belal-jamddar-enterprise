'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const fileInputRef = useRef(null);

  // ===== পারমিশন চেক =====
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          const permissions = data.user.permissions || [];
          const canAdd = permissions.includes('add_product') || 
                         permissions.includes('all') || 
                         data.user.role === 'Super Admin';
          setHasPermission(canAdd);
          if (!canAdd) {
            alert('❌ You do not have permission to add products!');
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

  // ===== ইমেজ রিমুভ =====
  const removeImageField = (index) => {
    if (imageUrls.length <= 1) {
      alert('At least one image is required!');
      return;
    }
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // ===== ফাইল আপলোড =====
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let addedCount = 0;

    for (let i = 0; i < files.length && addedCount < 10; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        alert(`❌ ${file.name}: Not an image file`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newUrls = [...imageUrls];
        const emptyIndex = newUrls.indexOf('');
        if (emptyIndex !== -1) {
          newUrls[emptyIndex] = e.target.result;
          setImageUrls([...newUrls]);
        } else if (newUrls.length < 10) {
          newUrls.push(e.target.result);
          setImageUrls([...newUrls]);
        }
      };
      reader.readAsDataURL(file);
      addedCount++;
    }

    if (addedCount === 0) {
      alert('Please select valid image files!');
    }
  };

  // ===== ড্র্যাগ-এন্ড-ড্রপ =====
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const event = { target: { files: files } };
      handleFileUpload(event);
    }
  };

  // ===== BDT ফরম্যাট =====
  const formatPrice = (value) => {
    const cleaned = value.replace(/[^0-9,]/g, '');
    return cleaned;
  };

  const handlePriceChange = (e) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  // ===== সাবমিট =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validImages = imageUrls.filter(url => url.trim() !== '');
    
    if (validImages.length === 0) {
      alert('Please add at least one image!');
      setLoading(false);
      return;
    }

    const priceValue = price.replace(/[^0-9,]/g, '');

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: priceValue || price,
      images: validImages
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('✅ Product added successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setImageUrls(['']);
        router.push('/admin/dashboard');
      } else {
        const error = await response.json();
        alert('❌ Failed to add product: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Checking permissions...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '700px', 
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      
      <button 
        onClick={() => router.push('/admin/dashboard')}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          background: '#e2e8f0', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontWeight: '600', 
          color: '#4a5568'
        }}
      >
        ← Back to Dashboard
      </button>

      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: '#1a202c', 
        marginBottom: '20px'
      }}>
        ➕ Add New Product
      </h2>

      <form onSubmit={handleSubmit} style={{ 
        background: '#fff', 
        padding: '25px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
      }}>
        
        <div style={{ marginBottom: '18px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            📝 Title <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input 
            type="text" 
            required
            placeholder="e.g., iPhone 15 Pro Max 256GB - Brand New"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '2px solid #e2e8f0', 
              borderRadius: '8px', 
              outline: 'none',
              fontSize: '15px'
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#ff6600'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            📄 Description <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <textarea 
            rows="4"
            required
            placeholder="Write full product details here..."
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '2px solid #e2e8f0', 
              borderRadius: '8px', 
              outline: 'none', 
              resize: 'vertical',
              fontSize: '15px',
              fontFamily: 'inherit',
              minHeight: '100px'
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#ff6600'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            💰 Price (BDT) <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '12px 16px', 
              background: '#f7f8fa', 
              border: '2px solid #e2e8f0', 
              borderRadius: '8px',
              fontWeight: '700',
              color: '#ff6600',
              fontSize: '16px'
            }}>
              ৳
            </span>
            <input 
              type="text" 
              required
              placeholder="1,35,000"
              style={{ 
                flex: 1,
                minWidth: '150px',
                padding: '12px 16px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px', 
                outline: 'none',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c'
              }}
              value={price}
              onChange={handlePriceChange}
              onFocus={(e) => e.target.style.borderColor = '#ff6600'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={{ 
              padding: '12px 16px', 
              background: '#f7f8fa', 
              border: '2px solid #e2e8f0', 
              borderRadius: '8px',
              fontWeight: '600',
              color: '#4a5568',
              fontSize: '14px'
            }}>
              BDT
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            🖼️ Product Images <span style={{ color: '#e53e3e' }}>*</span>
            <span style={{ fontSize: '12px', color: '#a0aec0', marginLeft: '10px' }}>
              (Max 10 images)
            </span>
          </label>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#ff6600' : '#cbd5e1'}`,
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              background: dragOver ? '#fff5f0' : '#f7f8fa',
              transition: 'all 0.3s',
              marginBottom: '15px',
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>⬇️</div>
            <p style={{ color: '#4a5568', fontWeight: '500', fontSize: '15px' }}>
              {dragOver ? '📥 Drop your images here!' : '🖱️ Drag & Drop images here'}
            </p>
            <p style={{ fontSize: '13px', color: '#a0aec0' }}>
              or click to browse (JPG, PNG, WebP)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          {imageUrls.map((url, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '8px',
                alignItems: 'center',
                background: '#f7f8fa',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#718096',
                minWidth: '30px'
              }}>
                #{index + 1}
              </span>
              <input 
                type="text" 
                placeholder={`Image URL ${index + 1}`}
                style={{ 
                  flex: 1,
                  minWidth: '120px',
                  padding: '10px 14px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '6px', 
                  outline: 'none',
                  fontSize: '14px',
                  background: '#fff'
                }}
                value={url}
                onChange={(e) => {
                  const newUrls = [...imageUrls];
                  newUrls[index] = e.target.value;
                  setImageUrls(newUrls);
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6600'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                style={{
                  padding: '6px 12px',
                  background: '#e53e3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '12px 24px',
              background: '#4299e1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'background 0.3s',
              width: '100%',
              marginTop: '5px'
            }}
          >
            📎 Attach File
          </button>

          {imageUrls.some(url => url.trim() !== '') && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                📸 Preview ({imageUrls.filter(u => u.trim() !== '').length} images)
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap' 
              }}>
                {imageUrls.filter(u => u.trim() !== '').map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: '70px', height: '70px' }}>
                    <img 
                      src={url} 
                      alt={`Preview ${i + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: i === 0 ? '3px solid #ff6600' : '1px solid #e2e8f0'
                      }}
                    />
                    {i === 0 && (
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        background: '#ff6600',
                        color: '#fff',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '8px',
                        fontWeight: '600'
                      }}>
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: loading ? '#cbd5e1' : '#ff6600', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '700', 
            fontSize: '18px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {loading ? '⏳ Publishing Product...' : '🚀 Publish Product'}
        </button>

      </form>
    </div>
  );
}
