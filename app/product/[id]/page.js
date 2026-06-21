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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const found = data.find(p => p.id === parseInt(params.id));
        if (found) {
          setProduct(found);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const phone = "8801581427849";
    const msg = `Hi! I want to order:\n\n📦 ${product.title}\n💰 BDT ${product.price}\n🆔 ID: #${product.id}\n📝 ${product.description}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePayment = (method) => {
    const phone = "8801782407055";
    const msg = `Hi! I want to pay via ${method} for Product: ${product?.title} (ID: #${product?.id})`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
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
    return null;
  }

  const images = product.images || [product.image];
  const img = images[currentImage] || 'https://via.placeholder.com/600x600?text=No+Image';

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": images[0] || product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "BDT",
      "availability": "https://schema.org/InStock",
      "url": `https://belal-jamddar-enterprise.vercel.app/product/${product.id}`,
      "seller": {
        "@type": "Organization",
        "name": "Belal Jamddar Enterprise"
      }
    }
  };

  return (
    <>
      <Head>
        <title>{product.title} - Belal Jamddar Enterprise</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={images[0] || product.image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />
      </Head>

      <header className="navbar">
        <div className="navbar-left">
          <div className="logo-badge" onClick={() => router.push('/')}>
            <img src="/logo.png" alt="Belal Jamddar" />
          </div>
          <div className="logo-text" onClick={() => router.push('/')}>
            Belal <span>Jamddar</span> Enterprise
          </div>
        </div>

        <div className="navbar-center">
          <div className="navbar-search">
            <span className="navbar-search-icon">
              <i className="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              className="navbar-search-input"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  router.push(`/?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>
        </div>

        <div className="navbar-right">
          <a href="mailto:bellalkhan736@gmail.com" className="contact-item">
            <i className="fas fa-envelope"></i>
            <span className="label">Email:</span>
            <span className="value">bellalkhan736@gmail.com</span>
          </a>
          <a href="https://wa.me/8801581427849" target="_blank" className="contact-item">
            <i className="fab fa-whatsapp"></i>
            <span className="label">WhatsApp:</span>
            <span className="value">01581427849</span>
          </a>
          <a href="https://maps.google.com/?q=Dhaka,Bangladesh" target="_blank" className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span className="label">Location:</span>
            <span className="value">Dhaka, Bangladesh</span>
          </a>
        </div>
      </header>

      <div className="divider-line"><hr /></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 4% 40px' }}>
        <button 
          onClick={() => router.push('/')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ff6600', 
            fontSize: '16px', 
            cursor: 'pointer', 
            marginBottom: '20px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Products
        </button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          background: '#fff', 
          padding: '30px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {images.map((im, i) => (
                  <img 
                    key={i} 
                    src={im} 
                    alt={`${product.title} - Image ${i + 1}`} 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      border: i === currentImage ? '3px solid #ff6600' : '1px solid #ddd'
                    }} 
                    onClick={() => setCurrentImage(i)} 
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: '28px', color: '#333' }}>{product.title}</h1>
            <p style={{ fontSize: '30px', fontWeight: '700', color: '#ff6600', margin: '15px 0' }}>
              <i className="fas fa-taka"></i> {product.price}
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#4a5568', marginBottom: '8px' }}>📝 Description</h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              <h3>💳 Payment Options</h3>
              <p style={{ fontSize: '13px', color: '#718096', marginBottom: '10px' }}>
                Agent Number: <strong>01782-407055</strong> (bKash, Nagad, Rocket)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '10px 0' }}>
                <button onClick={() => handlePayment('bKash')} style={{ padding: '14px', background: '#e2136e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>🏦 bKash</button>
                <button onClick={() => handlePayment('Nagad')} style={{ padding: '14px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>📱 Nagad</button>
                <button onClick={() => handlePayment('Rocket')} style={{ padding: '14px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>🚀 Rocket</button>
              </div>
              <div style={{ background: '#f7f8fa', padding: '12px', borderRadius: '8px' }}>
                <p>✅ Cash on Delivery available</p>
                <p>💰 Negotiable - Contact for price discussion</p>
              </div>
            </div>

            <button onClick={handleWhatsAppOrder} style={{ width: '100%', padding: '16px', background: '#25d366', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginTop: '20px' }}>
              💬 Order Now via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}