'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../../components/AdminNav';
import { ROLE_PERMISSIONS, ROLE_LABELS, permissionsForRole } from '../../../lib/permissions';

export default function UsersManagement() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'manager' });
  const [submitting, setSubmitting] = useState(false);

  // ===== AUTH CHECK =====
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setCurrentUser(await res.json());
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

  // ===== USER LIST (Supabase theke real data) =====
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        setUsers(await res.json());
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'super_admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // ===== ইউজার অ্যাড =====
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('All fields are required!');
      return;
    }
    if (newUser.password.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${newUser.name} added successfully!`);
        setNewUser({ name: '', email: '', password: '', role: 'manager' });
        setShowAddUser(false);
        fetchUsers();
      } else {
        alert('❌ ' + (data.message || 'Failed to add user'));
      }
    } catch (error) {
      alert('❌ Server error');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== ইউজার ডিলিট =====
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert('✅ User deleted!');
        fetchUsers();
      } else {
        alert('❌ ' + (data.message || 'Error'));
      }
    } catch (error) {
      alert('❌ Server error');
    }
  };

  // ===== রোল আপডেট =====
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Role updated!');
        fetchUsers();
      } else {
        alert('❌ ' + (data.message || 'Error'));
      }
    } catch (error) {
      alert('❌ Server error');
    }
  };

  const getPermissionBadges = (permissions) => {
    if (!permissions) return null;
    if (permissions.includes('all')) {
      return <span style={{ background: '#ff6600', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '11px' }}>All Access</span>;
    }
    return permissions.map((p, i) => (
      <span key={i} style={{ background: '#edf2f7', color: '#4a5568', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', marginRight: '4px', display: 'inline-block' }}>
        {p.replace('_', ' ')}
      </span>
    ));
  };

  if (!authChecked || !currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading...</p>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto', fontFamily: 'sans-serif', background: '#f7f8fa', minHeight: '100vh' }}>

      <AdminNav user={currentUser} active="/admin/users" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
            👥 User Management
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            {isSuperAdmin ? `Manage admin users and their permissions • ${users.length} users` : '👋 You have view-only access'}
          </p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setShowAddUser(true)} style={{ padding: '12px 24px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            ➕ Add New User
          </button>
        )}
      </div>

      {!isSuperAdmin ? (
        <div style={{ background: '#fff', padding: '60px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '60px', marginBottom: '15px' }}>🔒</div>
          <h2 style={{ color: '#e53e3e', marginBottom: '10px' }}>Access Denied</h2>
          <p style={{ color: '#718096' }}>Only <strong style={{ color: '#ff6600' }}>Super Admin</strong> can manage users.</p>
        </div>
      ) : (
        <>
          {/* ===== ADD USER MODAL ===== */}
          {showAddUser && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h2 style={{ marginBottom: '20px' }}>➕ Add New Admin User</h2>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Full Name *</label>
                  <input type="text" placeholder="e.g., John Doe" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email * <span style={{ fontWeight: 400, color: '#a0aec0' }}>(এই email দিয়েই উনি login করবেন)</span></label>
                  <input type="email" placeholder="user@example.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Password * <span style={{ fontWeight: 400, color: '#a0aec0' }}>(কমপক্ষে ৮ ক্যারেক্টার)</span></label>
                  <input type="password" placeholder="Enter password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Role / Permissions *</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                    <option value="super_admin">👑 Super Admin (All Access)</option>
                    <option value="manager">📋 Manager (Add, Edit, Delete, View)</option>
                    <option value="editor">✏️ Editor (Add, Edit, View)</option>
                    <option value="viewer">👁️ Viewer (View Only)</option>
                  </select>

                  <div style={{ marginTop: '10px', padding: '12px', background: '#f7f8fa', borderRadius: '6px' }}>
                    <p style={{ fontSize: '13px', color: '#4a5568' }}><strong>Permissions:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                      {permissionsForRole(newUser.role).map((p, i) => (
                        <span key={i} style={{ background: '#48bb78', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '11px' }}>
                          ✅ {p.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleAddUser} disabled={submitting} style={{ flex: 1, padding: '12px', background: submitting ? '#cbd5e1' : '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                    {submitting ? 'Adding...' : 'Add User'}
                  </button>
                  <button onClick={() => setShowAddUser(false)} style={{ padding: '12px 24px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS TABLE ===== */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {loadingUsers ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="loader"></div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7f8fa', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>#</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Name</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Email</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Role</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Permissions</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 18px', fontSize: '14px', color: '#718096' }}>{i + 1}</td>
                        <td style={{ padding: '12px 18px', fontWeight: '500' }}>
                          {u.name}
                          {u.id === currentUser.id && (
                            <span style={{ marginLeft: '8px', background: '#ff6600', color: '#fff', padding: '1px 8px', borderRadius: '10px', fontSize: '10px' }}>You</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 18px', color: '#4a5568' }}>{u.email}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{
                            background: u.role === 'super_admin' ? '#ff6600' : u.role === 'manager' ? '#4299e1' : u.role === 'editor' ? '#48bb78' : '#a0aec0',
                            color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                          }}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {getPermissionBadges(u.permissions)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                          {u.id !== currentUser.id ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', background: '#fff' }}>
                                <option value="super_admin">👑 Super Admin</option>
                                <option value="manager">📋 Manager</option>
                                <option value="editor">✏️ Editor</option>
                                <option value="viewer">👁️ Viewer</option>
                              </select>
                              <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '4px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#a0aec0' }}>🔒 This is you</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ===== PERMISSION GUIDE ===== */}
          <div style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>📋 Permission Guide</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#f7f8fa', borderRadius: '6px' }}>
                <strong style={{ color: '#ff6600' }}>👑 Super Admin</strong>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>All permissions • Full control</p>
              </div>
              <div style={{ padding: '10px', background: '#f7f8fa', borderRadius: '6px' }}>
                <strong style={{ color: '#4299e1' }}>📋 Manager</strong>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>View, Add, Edit, Delete products</p>
              </div>
              <div style={{ padding: '10px', background: '#f7f8fa', borderRadius: '6px' }}>
                <strong style={{ color: '#48bb78' }}>✏️ Editor</strong>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>View, Add, Edit products</p>
              </div>
              <div style={{ padding: '10px', background: '#f7f8fa', borderRadius: '6px' }}>
                <strong style={{ color: '#a0aec0' }}>👁️ Viewer</strong>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>View only • No changes</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', padding: '20px', color: '#a0aec0', fontSize: '13px', marginTop: '20px' }}>
        Belal Jamddar Enterprise © 2024 | All Rights Reserved
      </div>
    </div>
  );
}
