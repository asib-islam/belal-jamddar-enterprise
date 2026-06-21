'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-chart-bar' },
  { href: '/admin/add-product', label: 'Add Product', icon: 'fa-plus', hideForViewer: true },
  { href: '/admin/users', label: 'Users', icon: 'fa-users', onlyFor: 'super_admin' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
  { href: '/', label: 'Store', icon: 'fa-store' },
];

// user = { id, name, email, role } - /api/auth/me theke asha object
// active = current page-er href, jeta highlight kora hobe
export default function AdminNav({ user, active }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.onlyFor && user?.role !== item.onlyFor) return false;
    if (item.hideForViewer && user?.role === 'viewer') return false;
    return true;
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '25px',
      background: '#fff',
      padding: '16px 25px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '8px 16px',
              background: active === item.href ? '#ff6600' : '#f7f8fa',
              color: active === item.href ? '#fff' : '#2d3748',
              border: '1px solid ' + (active === item.href ? '#ff6600' : '#e2e8f0'),
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <i className={`fas ${item.icon}`}></i> {item.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && (
          <span style={{ fontSize: '13px', color: '#718096' }}>
            👋 <strong style={{ color: '#1a202c' }}>{user.name}</strong>{' '}
            <span style={{
              background: '#fff5f0',
              color: '#ff6600',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700',
              marginLeft: '4px'
            }}>
              {user.role}
            </span>
          </span>
        )}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}
