'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [user, setUser] = useState(null); // বর্তমান ইউজার
  const [checking, setChecking] = useState(true);

  // ===== বর্তমান ইউজার চেক =====
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/admin/login');
      } finally {
        setChecking(false);
      }
    };
    checkUser();
  }, [router]);

  // ===== প্রোডাক্ট লোড =====
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  // ===== পারমিশন চেক =====
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  // ===== ফিল্টার =====
  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===== ডিলিট =====
  const handleDelete = async (id) => {
    if (!hasPermission('delete_product')) {
      alert('❌ You do not have permission to delete products!');
      return;
    }

    const isConfirmed = window.confirm('⚠️ Are you sure you want to delete this product?\n\nThis action cannot be undone!');
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('✅ Product deleted!');
        fetchProducts();
      }
    } catch (error) {
      alert('❌ Error');
    }
  };

  // ===== লগআউট =====
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (checking || loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
      background: '#f7f8fa',
      minHeight: '100vh'
    }}>
      {/* ===== HEADER ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px',
        background: '#fff',
        padding: '20px 25px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
            <i className="fas fa-chart-bar"></i> Dashboard
            <span style={{
              marginLeft: '10px',
              background: user?.role === 'Super Admin' ? '#ff6600' : '#4299e1',
              color: '#fff',
              padding: '2px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {user?.role === 'Super Admin' ? '👑 Super Admin' : '👤 ' + user?.role}
            </span>
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
            <i className="fas fa-hand-wave"></i> Welcome back, <strong style={{ color: '#ff6600' }}>{user?.name}</strong>!
            <span style={{ marginLeft: '10px', background: '#edf2f7', padding: '2px 12px', borderRadius: '20px', fontSize: '12px' }}>
              {products.length} Products
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* শুধু পারমিশন থাকলে দেখাবে */}
          {hasPermission('add_product') && (
            <Link href="/admin/add-product" style={{
              padding: '10px 20px',
              background: '#ff6600',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-plus"></i> Add Product
            </Link>
          )}
          {hasPermission('manage_users') && (
            <Link href="/admin/users" style={{
              padding: '10px 20px',
              background: '#4299e1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-users"></i> Users
            </Link>
          )}
          {hasPermission('manage_settings') && (
            <Link href="/admin/settings" style={{
              padding: '10px 20px',
              background: '#9f7aea',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-cog"></i> Settings
            </Link>
          )}
          <Link href="/" style={{
            padding: '10px 20px',
            background: '#48bb78',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <i className="fas fa-store"></i> Store
          </Link>
          <button onClick={handleLogout} style={{
            padding: '10px 20px',
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* ===== STATS CARDS (শুধু Admin দেখবে) ===== */}
      {user?.role === 'Super Admin' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ color: '#718096', fontSize: '13px' }}><i className="fas fa-box"></i> Total Products</p>
            <h2 style={{ fontSize: '30px', color: '#ff6600' }}>{products.length}</h2>
          </div>
          <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ color: '#718096', fontSize: '13px' }}><i className="fas fa-tags"></i> Categories</p>
            <h2 style={{ fontSize: '30px', color: '#4299e1' }}>
              {new Set(products.map(p => p.category || 'Uncategorized')).size}
            </h2>
          </div>
        </div>
      )}

      {/* ===== SEARCH ===== */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              outline: 'none',
              fontSize: '14px',
              background: '#fff'
            }}
          />
        </div>
        {hasPermission('delete_product') && selectedProducts.length > 0 && (
          <button
            onClick={async () => {
              if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
                for (const id of selectedProducts) {
                  await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
                }
                setProducts(products.filter(p => !selectedProducts.includes(p.id)));
                setSelectedProducts([]);
                alert('✅ Deleted!');
                fetchProducts();
              }
            }}
            style={{
              padding: '10px 20px',
              background: '#e53e3e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fas fa-trash-alt"></i> Delete ({selectedProducts.length})
          </button>
        )}
        <span style={{
          padding: '10px 18px',
          background: '#fff',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          fontSize: '14px',
          color: '#4a5568'
        }}>
          <i className="fas fa-list"></i> {filteredProducts.length} / {products.length}
        </span>
      </div>

      {/* ===== PRODUCT TABLE ===== */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#718096' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}><i className="fas fa-box-open"></i></div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px', color: '#4a5568' }}>No Products Found</h3>
            <p>{searchTerm ? 'Try different keywords.' : 'Add your first product!'}</p>
            {!searchTerm && hasPermission('add_product') && (
              <Link href="/admin/add-product" style={{
                marginTop: '15px',
                padding: '12px 30px',
                background: '#ff6600',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fas fa-plus"></i> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7f8fa', borderBottom: '2px solid #e2e8f0' }}>
                  {hasPermission('delete_product') && (
                    <th style={{ padding: '12px 15px', textAlign: 'center', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={() => {
                          if (selectedProducts.length === filteredProducts.length) {
                            setSelectedProducts([]);
                          } else {
                            setSelectedProducts(filteredProducts.map(p => p.id));
                          }
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </th>
                  )}
                  <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>#</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}><i className="fas fa-image"></i> Image</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}><i className="fas fa-tag"></i> Title</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}><i className="fas fa-dollar-sign"></i> Price</th>
                  <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '13px', color: '#4a5568' }}><i className="fas fa-cog"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => {
                  const img = (p.images?.[0] || p.image || 'https://via.placeholder.com/50');
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {hasPermission('delete_product') && (
                        <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p.id)}
                            onChange={() => {
                              if (selectedProducts.includes(p.id)) {
                                setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                              } else {
                                setSelectedProducts([...selectedProducts, p.id]);
                              }
                            }}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </td>
                      )}
                      <td style={{ padding: '10px 15px', fontSize: '14px', color: '#718096' }}>{i + 1}</td>
                      <td style={{ padding: '10px 15px' }}>
                        <img src={img} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      </td>
                      <td style={{ padding: '10px 15px', fontSize: '14px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '10px 15px', fontSize: '15px', fontWeight: '700', color: '#ff6600' }}>
                        ৳ {p.price}
                      </td>
                      <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Link href={`/product/${p.id}`} style={{
                            padding: '5px 12px',
                            background: '#48bb78',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <i className="fas fa-eye"></i> View
                          </Link>
                          {hasPermission('edit_product') && (
                            <Link href={`/admin/edit-product/${p.id}`} style={{
                              padding: '5px 12px',
                              background: '#4299e1',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <i className="fas fa-edit"></i> Edit
                            </Link>
                          )}
                          {hasPermission('delete_product') && (
                            <button onClick={() => handleDelete(p.id)} style={{
                              padding: '5px 12px',
                              background: '#e53e3e',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#a0aec0',
        fontSize: '13px',
        marginTop: '20px',
        borderTop: '1px solid #e2e8f0'
      }}>
        Belal Jamddar Enterprise © 2024 | All Rights Reserved
      </div>
    </div>
  );
}
