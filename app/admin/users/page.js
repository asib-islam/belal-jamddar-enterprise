'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsersManagement() {
  const router = useRouter();
  
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

  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [loading, setLoading] = useState(false);

  // ===== ইউজার অ্যাড =====
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('⚠️ All fields are required!');
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

  // ===== ইউজার ডিলিট (Confirm সহ) =====
  const handleDeleteUser = (id) => {
    if (id === 1) {
      alert('❌ Cannot delete Super Admin!');
      return;
    }

    const userToDelete = users.find(u => u.id === id);
    const isConfirmed = window.confirm(
      `⚠️ Are you sure you want to delete "${userToDelete?.name}"?\n\nEmail: ${userToDelete?.email}\nThis action cannot be undone!`
    );

    if (!isConfirmed) {
      return;
    }

    setUsers(users.filter(u => u.id !== id));
    alert(`✅ ${userToDelete?.name} deleted successfully!`);
  };

  // ===== রোল আপডেট =====
  const handleRoleChange = (id, newRole) => {
    if (id === 1) {
      alert('❌ Cannot change Super Admin role!');
      return;
    }

    const isConfirmed = window.confirm(
      `⚠️ Are you sure you want to change this user's role?\n\nThis action cannot be undone!`
    );

    if (!isConfirmed) {
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
    alert('✅ Role updated successfully!');
  };

  const getPermissionBadges = (permissions) => {
    if (permissions.includes('all')) {
      return <span className="badge badge-all"><i className="fas fa-check-circle"></i> All Access</span>;
    }
    return permissions.map((p, i) => (
      <span key={i} className="badge badge-permission">
        <i className="fas fa-check"></i> {p.replace('_', ' ')}
      </span>
    ));
  };

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
            <i className="fas fa-users"></i> User Management
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
                <i className="fas fa-crown"></i> Super Admin
              </span>
            )}
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            <i className="fas fa-users-cog"></i> Manage admin users and their permissions • <strong>{users.length}</strong> users
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
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-plus"></i> Add New User
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
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

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
            <h2 style={{ marginBottom: '20px' }}>
              <i className="fas fa-user-plus"></i> Add New Admin User
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                <i className="fas fa-user"></i> Full Name *
              </label>
              <input 
                type="text" 
                placeholder="e.g., John Doe"
                value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                <i className="fas fa-envelope"></i> Email *
              </label>
              <input 
                type="email" 
                placeholder="user@example.com"
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                <i className="fas fa-lock"></i> Password *
              </label>
              <input 
                type="password" 
                placeholder="Enter password"
                value={newUser.password} 
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                <i className="fas fa-user-tag"></i> Role / Permissions *
              </label>
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
                  <i className="fas fa-key"></i> <strong>Permissions:</strong>
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
                      <i className="fas fa-check-circle"></i> {p.replace('_', ' ')}
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
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-save"></i> Add User
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
                <i className="fas fa-times"></i> Cancel
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
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-hashtag"></i> #
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-user"></i> Name
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-envelope"></i> Email
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-user-tag"></i> Role
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-key"></i> Permissions
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-circle"></i> Status
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>
                  <i className="fas fa-cog"></i> Actions
                </th>
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
                        <i className="fas fa-crown"></i> Owner
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
                      <i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '4px' }}></i>
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
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#a0aec0' }}>
                          <i className="fas fa-lock"></i> Protected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
