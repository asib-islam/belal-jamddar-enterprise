import { NextResponse } from 'next/server';

// ===== ডেমো ইউজার ডাটাবেস =====
const USERS = [
  {
    id: 1,
    name: 'Belal Jamddar',
    email: 'admin@belaljamddar.com',
    password: 'Belal@2024',
    role: 'Super Admin',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'John Manager',
    email: 'manager@belaljamddar.com',
    password: 'Manager@123',
    role: 'Manager',
    permissions: ['view_products', 'add_product', 'edit_product', 'delete_product']
  },
  {
    id: 3,
    name: 'Jane Editor',
    email: 'editor@belaljamddar.com',
    password: 'Editor@123',
    role: 'Editor',
    permissions: ['view_products', 'add_product', 'edit_product']
  },
  {
    id: 4,
    name: 'Sam Viewer',
    email: 'viewer@belaljamddar.com',
    password: 'Viewer@123',
    role: 'Viewer',
    permissions: ['view_products']
  }
];

// ===== বর্তমান ইউজার তথ্য =====
export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ user: null, error: 'Not authenticated' }, { status: 401 });
    }

    // ডেমো: সবসময় Super Admin রিটার্ন করুন
    const user = USERS[0];
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ user: null, error: 'Server error' }, { status: 500 });
  }
}

// ===== ইউজার লগইন (ডেমো) =====
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({ 
      user: userWithoutPassword,
      message: 'Login successful' 
    }, { status: 200 });
    
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
