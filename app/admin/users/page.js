'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersManagement() {
  const router = useRouter();
  
  // ===== CURRENT ADMIN CHECK =====
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // পারমিশন ডেফিনেশন
  const PERMISSIONS = {
    SUPER_ADMIN: {
      label: '👑 Super Admin',
      value: 'super_admin',
      permissions: ['all']
    },
    MANAGER: {
      label: '📋 Manager',
      value: 'manager',
      permissions: ['view_products', 'add_product', 'edit_product', 'delete_product']
    },
    EDITOR: {
      label: '✏️ Editor',
      value: 'editor',
      permissions: ['view_products', 'add_product', 'edit_product']
    },
    VIEWER: {
      label: '👁️ Viewer',
      value: 'viewer',
      permissions: ['view_products']
    }
  };

  // ইউজার লিস্ট
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Belal Jamddar', 
      email: 'admin@belaljamddar.com', 
      role: 'super_admin',
      roleLabel: '👑 Super Admin',
      permissions: ['all'],
      status: 'Active',
      joined: '2024-01-01'
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  // ===== CHECK IF CURRENT USER IS SUPER ADMIN =====
  useEffect(() => {
    // বর্তমান ইউজার চেক (ডেমো - রিয়েল অ্যাপে কুকি/সেশন থেকে চেক করবেন)
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
          setIsSuperAdmin(data.role === 'super_admin');
        } else {
          // ডেমো: প্রথম ইউজারকে Super Admin ধরে নিচ্ছি
          setIsSuperAdmin(true);
        }
      } catch (error) {
        setIsSuperAdmin(true);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  // ===== ইউজার অ্যাড (শুধু Super Admin) =====
  const handleAddUser = () => {
    if (!isSuperAdmin) {
      alert('❌ Only Super Admin can add users!');
      return;
    }

    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('All fields are required!');
      return;
    }

    const roleData = PERMISSIONS[newUser.role.toUpperCase()];
    const newUserData = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      roleLabel: roleData.label,
      permissions: roleData.permissions,
      status: 'Active',
      joined: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUserData]);
    setNewUser({ name: '', email: '', password: '', role: 'manager' });
    setShowAddUser(false);
    alert(`✅ ${newUser.name} added successfully!`);
  };

  // ===== ইউজার ডিলিট (শুধু Super Admin) =====
  const handleDeleteUser = (id) => {
    if (!isSuperAdmin) {
      alert('❌ Only Super Admin can delete users!');
      return;
    }

    if (id === 1) {
      alert('❌ Cannot delete Super Admin!');
      return;
    }
    if (!confirm('Delete this user?')) return;
    setUsers(users.filter(u => u.id !== id));
    alert('✅ User deleted!');
  };

  // ===== রোল আপডেট (শুধু Super Admin) =====
  const handleRoleChange = (id, newRole) => {
    if (!isSuperAdmin) {
      alert('❌ Only Super Admin can change roles!');
      return;
    }

    if (id === 1) {
      alert('❌ Cannot change Super Admin role!');
      return;
    }
    const roleData = PERMISSIONS[newRole.toUpperCase()];
    setUsers(users.map(u => 
      u.id === id 
        ? { 
            ...u, 
            role: newRole, 
            roleLabel: roleData.label,
            permissions: roleData.permissions 
          } 
        : u
    ));
    alert('✅ Role updated!');
  };

  // ===== পারমিশন চেক =====
  const hasPermission = (user, permission) => {
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  // ===== পারমিশন ব্যাজ =====
  const getPermissionBadges = (permissions) => {
    if (permissions.includes('all')) {
      return <span style={{ background: '#ff6600', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '11px' }}>All Access</span>;
    }
    return permissions.map((p, i) => (
      <span key={i} style={{ 
        background: '#edf2f7', 
        color: '#4a5568', 
        padding: '2px 10px', 
        borderRadius: '12px', 
        fontSize: '11px',
        marginRight: '4px',
        display: 'inline-block'
      }}>
        {p.replace('_', ' ')}
      </span>
    ));
  };

  // ===== লোডিং =====
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loader"></div>
        <p style={{ color: '#718096', marginTop: '15px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1300px', 
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
            👥 User Management
            {isSuperAdmin && (
              <span style={{ 
                marginLeft: '10px', 
                background: '#ff6600', 
                color: '#fff', 
                padding: '2px 14px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                👑 Super Admin
              </span>
            )}
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            {isSuperAdmin 
              ? `Manage admin users and their permissions • ${users.length} users`
              : '👋 You have view-only access'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isSuperAdmin && (
            <button 
              onClick={() => setShowAddUser(true)} 
              style={{ 
                padding: '12px 24px', 
                background: '#ff6600', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600' 
              }}
            >
              ➕ Add New User
            </button>
          )}
          <button 
            onClick={() => router.push('/admin/dashboard')} 
            style={{ 
              padding: '12px 24px', 
              background: '#e2e8f0', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* ===== ACCESS DENIED (যদি Super Admin না হয়) ===== */}
      {!isSuperAdmin ? (
        <div style={{
          background: '#fff',
          padding: '60px 20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '15px' }}>🔒</div>
          <h2 style={{ color: '#e53e3e', marginBottom: '10px' }}>Access Denied</h2>
          <p style={{ color: '#718096' }}>
            Only <strong style={{ color: '#ff6600' }}>Super Admin</strong> can manage users.
          </p>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            style={{
              marginTop: '20px',
              padding: '12px 30px',
              background: '#ff6600',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* ===== ADD USER MODAL ===== */}
          {showAddUser && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}>
                <h2 style={{ marginBottom: '20px' }}>➕ Add New Admin User</h2>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., John Doe"
                    value={newUser.name} 
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email *</label>
                  <input 
                    type="email" 
                    placeholder="user@example.com"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Password *</label>
                  <input 
                    type="password" 
                    placeholder="Enter password"
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Role / Permissions *</label>
                  <select 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} 
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="super_admin">👑 Super Admin (All Access)</option>
                    <option value="manager">📋 Manager (Add, Edit, Delete, View)</option>
                    <option value="editor">✏️ Editor (Add, Edit, View)</option>
                    <option value="viewer">👁️ Viewer (View Only)</option>
                  </select>
                  
                  <div style={{ marginTop: '10px', padding: '12px', background: '#f7f8fa', borderRadius: '6px' }}>
                    <p style={{ fontSize: '13px', color: '#4a5568' }}>
                      <strong>Permissions:</strong>
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                      {PERMISSIONS[newUser.role.toUpperCase()].permissions.map((p, i) => (
                        <span key={i} style={{ 
                          background: '#48bb78', 
                          color: '#fff', 
                          padding: '2px 10px', 
                          borderRadius: '12px', 
                          fontSize: '11px' 
                        }}>
                          ✅ {p.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleAddUser} 
                    style={{ 
                      flex: 1,
                      padding: '12px', 
                      background: '#ff6600', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Add User
                  </button>
                  <button 
                    onClick={() => setShowAddUser(false)} 
                    style={{ 
                      padding: '12px 24px', 
                      background: '#e2e8f0', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS TABLE ===== */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f8fa', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>#</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Name</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Email</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Role</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Permissions</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 18px', fontSize: '14px', color: '#718096' }}>{i + 1}</td>
                      <td style={{ padding: '12px 18px', fontWeight: '500' }}>
                        {u.name}
                        {u.id === 1 && (
                          <span style={{ marginLeft: '8px', background: '#ff6600', color: '#fff', padding: '1px 8px', borderRadius: '10px', fontSize: '10px' }}>
                            Owner
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 18px', color: '#4a5568' }}>{u.email}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ 
                          background: u.role === 'super_admin' ? '#ff6600' : u.role === 'manager' ? '#4299e1' : u.role === 'editor' ? '#48bb78' : '#a0aec0',
                          color: '#fff',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {u.roleLabel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {getPermissionBadges(u.permissions)}
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ 
                          background: u.status === 'Active' ? '#48bb78' : '#e53e3e', 
                          color: '#fff', 
                          padding: '2px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px' 
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {u.id !== 1 ? (
                            <>
                              <select 
                                value={u.role} 
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                style={{ 
                                  padding: '4px 8px', 
                                  border: '1px solid #cbd5e1', 
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  background: '#fff'
                                }}
                              >
                                <option value="super_admin">👑 Super Admin</option>
                                <option value="manager">📋 Manager</option>
                                <option value="editor">✏️ Editor</option>
                                <option value="viewer">👁️ Viewer</option>
                              </select>
                              <button 
                                onClick={() => handleDeleteUser(u.id)} 
                                style={{ 
                                  padding: '4px 12px', 
                                  background: '#e53e3e', 
                                  color: '#fff', 
                                  border: 'none', 
                                  borderRadius: '4px', 
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                🗑
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#a0aec0' }}>🔒 Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== PERMISSION GUIDE ===== */}
          <div style={{
            marginTop: '20px',
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
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

      {/* ===== FOOTER ===== */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#a0aec0',
        fontSize: '13px',
        marginTop: '20px'
      }}>
        Belal Jamddar Enterprise © 2024 | All Rights Reserved
      </div>

    </div>
  );
}