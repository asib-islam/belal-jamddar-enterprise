// Central permission map - client (UI dekhano) ar server (API protect kora)
// duijaygay-i ai same map use hoy, jate dujaygay mil thake.
export const ROLE_PERMISSIONS = {
  super_admin: ['all'],
  manager: ['view_products', 'add_product', 'edit_product', 'delete_product'],
  editor: ['view_products', 'add_product', 'edit_product'],
  viewer: ['view_products'],
};

export const ROLE_LABELS = {
  super_admin: '👑 Super Admin',
  manager: '📋 Manager',
  editor: '✏️ Editor',
  viewer: '👁️ Viewer',
};

export function permissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer;
}

export function hasPermission(role, permission) {
  const perms = permissionsForRole(role);
  return perms.includes('all') || perms.includes(permission);
}
