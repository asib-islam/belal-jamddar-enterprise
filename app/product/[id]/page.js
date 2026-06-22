'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const found = data.find(p => p.id === parseInt(params.id));
        setProduct(found);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  // ===== COPY NUMBER FUNCTION =====
  const copyNumber = () => {
    const number = "01782407055";
    navigator.clipboard.writeText(number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      alert('Copy failed. Please copy manually: ' + number);
    });
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const phone = "8801581427849";
    const msg = `Hi! I want to order:\n\n📦 ${product.title}\n💰 BDT ${product.price}\n🆔 ID: #${product.id}\n📝 ${product.description}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const USSD_CODES = {
    bKash: '*247#',
    Nagad: '*167#',
    Rocket: '*322#',
  };

  const handlePayment = (method) => {
    const ussd = USSD_CODES[method];
    window.location.href = `tel:${encodeURIComponent(ussd)}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h3>❌ Product not found</h3>
        <button onClick={() => router.push('/')} style={{ padding: '10px 20px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Back to Home</button>
      </div>
    );
  }

  const images = product.images || [product.image];
  const img = images[currentImage] || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <>
      <Head>
        <title>{product.title} - Belal Jamaddar Enterprise</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={images[0] || product.image} />
      </Head>

      <header className="navbar">
        <div className="navbar-left">
          <div className="logo-badge" onClick={() => router.push('/')}>
            <img src="/logo.png" alt="Belal Jamaddar" />
          </div>
          <div className="logo-text" onClick={() => router.push('/')}>
            Belal <span>Jamaddar</span> Enterprise
          </div>
        </div>
        <div className="navbar-center">
          <div className="navbar-search">
            <span className="navbar-search-icon"><i className="fas fa-search"></i></span>
            <input type="text" className="navbar-search-input" placeholder="Search products..." onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { router.push(`/?search=${encodeURIComponent(e.target.value.trim())}`); } }} />
          </div>
        </div>
        <div className="navbar-right">
          <a href="mailto:belaljamaddarenterprise@gmail.com" className="contact-item"><i className="fas fa-envelope"></i><span className="label">Email:</span><span className="value">bellalkhan736@gmail.com</span></a>
          <a href="https://wa.me/8801581427849" target="_blank" className="contact-item"><i className="fab fa-whatsapp"></i><span className="label">WhatsApp:</span><span className="value">01581427849</span></a>
          <a href="https://maps.google.com/?q=Dhaka,Bangladesh" target="_blank" className="contact-item"><i className="fas fa-map-marker-alt"></i><span className="label">Location:</span><span className="value">Dhaka, Bangladesh</span></a>
        </div>
      </header>

      <div className="divider-line"><hr /></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 4% 40px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#ff6600', fontSize: '16px', cursor: 'pointer', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-arrow-left"></i> Back to Products
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {images.map((im, i) => (
                  <img key={i} src={im} alt={`${product.title} - Image ${i + 1}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === currentImage ? '3px solid #ff6600' : '1px solid #ddd', transition: 'border 0.3s' }} onClick={() => setCurrentImage(i)} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: '28px', color: '#333' }}>{product.title}</h1>
            <p style={{ fontSize: '30px', fontWeight: '700', color: '#ff6600', margin: '15px 0' }}>
              <i className="fas fa-taka" style={{ fontSize: '24px' }}></i> {product.price} <span style={{ fontSize: '16px', fontWeight: '400', color: '#718096' }}>BDT</span>
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#4a5568', marginBottom: '8px' }}><i className="fas fa-file-alt"></i> Description</h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            {/* ===== PAYMENT OPTIONS ===== */}
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}><i className="fas fa-credit-card"></i> Payment Options</h3>
              
              {/* ===== AGENT NUMBER WITH COPY BUTTON ===== */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f7f8fa',
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '14px', color: '#4a5568' }}>
                  💳 Agent Number: <strong style={{ color: '#ff6600' }}>01782-407055</strong>
                </span>
                <button
                  onClick={copyNumber}
                  style={{
                    padding: '6px 16px',
                    background: copied ? '#48bb78' : '#4299e1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '10px 0' }}>
                <button onClick={() => handlePayment('bKash')} style={{ padding: '14px', background: '#e2136e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}><i className="fas fa-mobile-alt"></i> bKash</button>
                <button onClick={() => handlePayment('Nagad')} style={{ padding: '14px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}><i className="fas fa-mobile-alt"></i> Nagad</button>
                <button onClick={() => handlePayment('Rocket')} style={{ padding: '14px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}><i className="fas fa-rocket"></i> Rocket</button>
              </div>
              <div style={{ background: '#f7f8fa', padding: '12px 15px', borderRadius: '8px' }}>
                <p><i className="fas fa-check-circle" style={{ color: '#48bb78' }}></i> Cash on Delivery available</p>
                <p><i className="fas fa-handshake" style={{ color: '#ff6600' }}></i> Negotiable - Contact for price discussion</p>
                <p style={{ fontSize: '13px', color: '#718096' }}>
                  <i className="fas fa-info-circle"></i> Agent Number: <strong>01782-407055</strong> (bKash/Nagad/Rocket)
                </p>
              </div>
            </div>

            <button onClick={handleWhatsAppOrder} style={{ width: '100%', padding: '16px', background: '#25d366', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginTop: '20px', transition: 'background 0.3s' }} onMouseEnter={(e) => e.target.style.background = '#128c7e'} onMouseLeave={(e) => e.target.style.background = '#25d366'}>
              <i className="fab fa-whatsapp"></i> Order Now via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}