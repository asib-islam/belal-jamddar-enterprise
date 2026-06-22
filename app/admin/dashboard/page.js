'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '../../../components/AdminNav';
import { hasPermission } from '../../../lib/permissions';

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({ total: 0, categories: {}, todayAdded: 0 });

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

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      const productsData = Array.isArray(data) ? data : [];
      setProducts(productsData);

      const total = productsData.length;
      const categories = {};
      productsData.forEach(p => {
        const cat = p.category || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      const today = new Date();
      const todayAdded = productsData.filter(p => {
        const created = new Date(p.created_at);
        return created.toDateString() === today.toDateString();
      }).length;

      setStats({ total, categories, todayAdded });
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

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEdit = hasPermission(user?.role, 'edit_product');
  const canDelete = hasPermission(user?.role, 'delete_product');
  const canAdd = hasPermission(user?.role, 'add_product');

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setSelectedProducts(selectedProducts.filter(sid => sid !== id));
        alert('✅ Deleted!');
        fetchProducts();
      }
    } catch (error) {
      alert('❌ Error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;

    try {
      for (const id of selectedProducts) {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      }
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      alert(`✅ ${selectedProducts.length} products deleted!`);
      fetchProducts();
    } catch (error) {
      alert('❌ Error');
    }
  };

  const toggleSelect = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(sid => sid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  if (!authChecked || !user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Checking access...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading dashboard...</p>
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

      {/* ===== AdminNav (ন্যাভবার) ===== */}
      <AdminNav user={user} active="/admin/dashboard" />

      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
          <i className="fas fa-chart-bar"></i> Dashboard
        </h1>
        <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
          Welcome back, <strong style={{ color: '#ff6600' }}>{user.name}</strong>!
          <span style={{ marginLeft: '10px', background: '#edf2f7', padding: '2px 12px', borderRadius: '20px', fontSize: '12px' }}>
            {products.length} Products
          </span>
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#718096', fontSize: '13px' }}><i className="fas fa-box"></i> Total Products</p>
          <h2 style={{ fontSize: '30px', color: '#ff6600' }}>{stats.total}</h2>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#718096', fontSize: '13px' }}><i className="fas fa-plus-circle"></i> Added Today</p>
          <h2 style={{ fontSize: '30px', color: '#48bb78' }}>{stats.todayAdded}</h2>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#718096', fontSize: '13px' }}><i className="fas fa-tags"></i> Categories</p>
          <h2 style={{ fontSize: '30px', color: '#4299e1' }}>{Object.keys(stats.categories).length}</h2>
        </div>
      </div>

      {/* ===== SEARCH + BULK DELETE ===== */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 18px', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none', fontSize: '14px', background: '#fff' }}
          />
        </div>
        {canDelete && selectedProducts.length > 0 && (
          <button onClick={handleBulkDelete} style={{ padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fas fa-trash-alt"></i> Delete ({selectedProducts.length})
          </button>
        )}
        {canAdd && (
          <Link href="/admin/add-product" style={{ padding: '10px 20px', background: '#ff6600', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fas fa-plus"></i> Add Product
          </Link>
        )}
        <span style={{ padding: '10px 18px', background: '#fff', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#4a5568' }}>
          <i className="fas fa-list"></i> {filteredProducts.length} / {products.length}
        </span>
      </div>

      {/* ===== PRODUCT TABLE ===== */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#718096' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}><i className="fas fa-box-open"></i></div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px', color: '#4a5568' }}>No Products Found</h3>
            <p>{searchTerm ? 'Try different keywords.' : 'Add your first product!'}</p>
            {!searchTerm && canAdd && (
              <Link href="/admin/add-product" style={{ marginTop: '15px', padding: '12px 30px', background: '#ff6600', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-plus"></i> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7f8fa', borderBottom: '2px solid #e2e8f0' }}>
                  {canDelete && (
                    <th style={{ padding: '12px 15px', textAlign: 'center', width: '40px' }}>
                      <input type="checkbox" checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} onChange={selectAll} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
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
                      {canDelete && (
                        <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                          <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleSelect(p.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        </td>
                      )}
                      <td style={{ padding: '10px 15px', fontSize: '14px', color: '#718096' }}>{i + 1}</td>
                      <td style={{ padding: '10px 15px' }}>
                        <img src={img} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      </td>
                      <td style={{ padding: '10px 15px', fontSize: '14px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                      <td style={{ padding: '10px 15px', fontSize: '15px', fontWeight: '700', color: '#ff6600' }}>৳ {p.price}</td>
                      <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Link href={`/product/${p.id}`} style={{ padding: '5px 12px', background: '#48bb78', color: '#fff', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-eye"></i> View
                          </Link>
                          {canEdit && (
                            <Link href={`/admin/edit-product/${p.id}`} style={{ padding: '5px 12px', background: '#4299e1', color: '#fff', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fas fa-edit"></i> Edit
                            </Link>
                          )}
                          {canDelete && (
                            <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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

      <div style={{ textAlign: 'center', padding: '20px', color: '#a0aec0', fontSize: '13px', marginTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        Belal Jamaddar Enterprise | All Rights Reserved
      </div>
    </div>
  );
}