'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AdminNav from '../components/AdminNav';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLocationImg, setShowLocationImg] = useState(false);

  const observerRef = useRef();
  const lastProductRef = useCallback((node) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreProducts();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore]);

  // ===== অ্যাডমিন চেক =====
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking admin:', error);
        setIsAdmin(false);
        setUser(null);
      }
    };
    checkAdmin();
  }, []);

  // ===== প্রোডাক্ট লোড =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
          setProducts(data.slice(0, 12));
          setHasMore(data.length > 12);
        } else {
          setAllProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load products');
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const start = (nextPage - 1) * 12;
    const end = start + 12;
    const newProducts = allProducts.slice(start, end);
    if (newProducts.length > 0) {
      setProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(end < allProducts.length);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (searchQuery === '') {
      setProducts(allProducts.slice(0, 12));
      setHasMore(allProducts.length > 12);
      setPage(1);
    }
  }, [searchQuery, allProducts]);

  const handleLocationClick = (e) => {
    e.preventDefault();
    setShowLocationImg(true);
    setTimeout(() => {
      window.open('https://maps.app.goo.gl/vNei7PC9NqUPvZMJ6', '_blank');
    }, 300);
  };

  const handleWhatsAppOrder = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    const phone = "01581427849";
    const msg = `Hi! I want to order:\n\n📦 ${product.title}\n💰 BDT ${product.price}\n🆔 ID: #${product.id}`;
    window.open(`https://wa.me/880${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <header className="navbar">
          <div className="navbar-left">
            <div className="logo-badge">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="logo-text">Belal <span>Jamaddar</span> Enterprise</div>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loader"></div>
          <p style={{ color: '#718096', marginTop: '15px' }}>Loading products...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="navbar">
          <div className="navbar-left">
            <div className="logo-badge">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="logo-text">Belal <span>Jamaddar</span> Enterprise</div>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3 style={{ color: '#e53e3e' }}>❌ {error}</h3>
          <button onClick={() => window.location.reload()} style={{ marginTop: '15px', padding: '10px 20px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Try Again</button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ===== অ্যাডমিন ন্যাভবার (শুধু লগইন করা অ্যাডমিন দেখতে পাবে) ===== */}
      {isAdmin && user && (
        <div style={{ padding: '12px 4% 0' }}>
          <AdminNav user={user} active="/" />
        </div>
      )}

      {/* ===== নরমাল ন্যাভবার (সবার জন্য) ===== */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo-badge" onClick={() => window.location.href = '/'}>
            <img src="/logo.png" alt="Belal Jamaddar Enterprise" />
          </div>
          <div className="logo-text" onClick={() => window.location.href = '/'}>
            Belal <span>Jamaddar</span> Enterprise
          </div>
        </div>

        <div className="navbar-center">
          <div className="navbar-search">
            <span className="navbar-search-icon"><i className="fas fa-search"></i></span>
            <input 
              type="text" 
              className="navbar-search-input"
              placeholder="Search products by title, description or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar-right">
          <a href="mailto:belaljamaddarenterprise@gmail.com" className="contact-item">
            <i className="fas fa-envelope"></i>
            <span className="label">Email:</span>
            <span className="value">belaljamaddarenterprise@gmail.com</span>
          </a>
          <a href="https://wa.me/8801581427849" target="_blank" className="contact-item">
            <i className="fab fa-whatsapp"></i>
            <span className="label">WhatsApp:</span>
            <span className="value">01581427849</span>
          </a>
         <a 
  href="https://maps.app.goo.gl/vNei7PC9NqUPvZMJ6" 
  target="_blank"
  rel="noopener noreferrer" 
  className="contact-item"
>
  <i className="fas fa-map-marker-alt"></i>
  <span className="label">Location:</span>
  <span className="value">Dhaka, Bangladesh</span>
</a>
          {isAdmin && (
            <a href="/admin/dashboard" className="contact-item admin-link-item">
              <i className="fas fa-cog" style={{ color: '#ff6600' }}></i>
              <span className="label" style={{ color: '#ff6600' }}>Dashboard</span>
            </a>
          )}
        </div>
      </header>

      <div className="divider-line"><hr /></div>

      <main className="main-container">
        {searchQuery && (
          <div className="search-result-count">
            <i className="fas fa-search"></i> Showing <strong>{filteredProducts.length}</strong> results
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {filteredProducts.map((product, index) => {
                const images = product.images || [product.image];
                const firstImage = images[0] || 'https://via.placeholder.com/300x300?text=No+Image';
                const isLast = index === filteredProducts.length - 1;

                return (
                  <Link ref={isLast ? lastProductRef : null} href={`/product/${product.id}`} key={product.id} className="product-card">
                    <div className="product-image-wrapper">
                      <img src={firstImage} alt={product.title} className="product-image" />
                      {images.length > 1 && (
                        <div className="image-badge"><i className="fas fa-images"></i> {images.length}</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-description">{product.description?.substring(0, 60)}...</p>
                      <p className="product-price">
                        <i className="fas fa-taka"></i> {product.price} <span style={{ fontSize: '12px', fontWeight: '400', color: '#718096' }}>BDT</span>
                      </p>
                    </div>
                    <button className="whatsapp-button" onClick={(e) => handleWhatsAppOrder(e, product)}>
                      <i className="fab fa-whatsapp"></i> Order Now
                    </button>
                  </Link>
                );
              })}
            </div>

            {loadingMore && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="loader" style={{ width: '30px', height: '30px' }}></div>
                <p style={{ color: '#718096', fontSize: '14px', marginTop: '8px' }}>Loading more...</p>
              </div>
            )}

            {!hasMore && !searchQuery && products.length > 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
                <i className="fas fa-check-circle" style={{ color: '#48bb78' }}></i> You've seen all {products.length} products
              </div>
            )}

            <div style={{ textAlign: 'center', padding: '15px', color: '#a0aec0', fontSize: '13px' }}>
              <i className="fas fa-box"></i> {filteredProducts.length} of {allProducts.length} products
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-store-alt"></i></div>
            <h2 className="empty-state-title">No Products Found</h2>
            <p className="empty-state-description">
              {searchQuery ? `No products match "${searchQuery}"` : 'No products have been added yet.'}
            </p>
            {!searchQuery && isAdmin && (
              <div className="empty-state-actions">
                <a href="/admin/dashboard" className="admin-btn"><i className="fas fa-cog"></i> Go to Admin Dashboard</a>
              </div>
            )}
          </div>
        )}
      </main>


      {/* ===== ফুটার (ছোট) ===== */}
      <footer style={{
        textAlign: 'center',
        padding: '10px',
        marginTop: '20px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        color: '#a0aec0',
        fontSize: '12px'
      }}>
        <p>
          Designed &amp; Developed by{' '}
          <a
            href="https://asib-islam.github.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ff6600',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#e65c00'}
            onMouseLeave={(e) => e.target.style.color = '#ff6600'}
          >
            Asib Islam
          </a>
        </p>
      </footer>
    </>
  );
}