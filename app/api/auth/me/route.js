import { NextResponse } from 'next/server';

// ডেমো ইউজার ডাটা (রিয়েল অ্যাপে ডাটাবেস থেকে আনতে হবে)
const USERS = [
  {
    id: 1,
    name: 'Belal Jamddar',
    email: 'admin@belaljamddar.com',
    role: 'Super Admin',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'John Manager',
    email: 'manager@belaljamddar.com',
    role: 'Manager',
    permissions: ['view_products', 'add_product', 'edit_product', 'delete_product']
  },
  {
    id: 3,
    name: 'Jane Editor',
    email: 'editor@belaljamddar.com',
    role: 'Editor',
    permissions: ['view_products', 'add_product', 'edit_product']
  },
  {
    id: 4,
    name: 'Sam Viewer',
    email: 'viewer@belaljamddar.com',
    role: 'Viewer',
    permissions: ['view_products']
  }
];

export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // ডেমো: সবসময় Super Admin রিটার্ন করুন (রিয়েল অ্যাপে session থেকে ইউজার আইডি বের করে আনবেন)
    // এখানে ডেমো জন্য প্রথম ইউজার রিটার্ন করছি
    const user = USERS[0]; // Super Admin
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
