import { NextResponse } from 'next/server';
import { verifySessionToken, hashPassword } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { permissionsForRole } from '../../../../lib/permissions';

function getCurrentUser(request) {
  const session = request.cookies.get('admin_session');
  return verifySessionToken(session?.value);
}

// ============================================
// GET: সব ইউজারের লিস্ট (শুধু Super Admin)
// ============================================
export async function GET(request) {
  const user = getCurrentUser(request);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, name, email, role, permissions, status, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

// ============================================
// POST: নতুন ইউজার যোগ (শুধু Super Admin) - email + password + role
// ============================================
export async function POST(request) {
  const user = getCurrentUser(request);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
        role,
        permissions: permissionsForRole(role),
        status: 'Active',
      }])
      .select('id, name, email, role, permissions, status, created_at');

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'This email is already registered' }, { status: 409 });
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '✅ User added successfully!', data: data[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// ============================================
// PUT: ইউজারের role পরিবর্তন (শুধু Super Admin)
// ============================================
export async function PUT(request) {
  const user = getCurrentUser(request);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, role } = await request.json();
    if (!id || !role) {
      return NextResponse.json({ message: 'id and role are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update({ role, permissions: permissionsForRole(role) })
      .eq('id', id)
      .select('id, name, email, role, permissions, status, created_at');

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: '✅ Role updated!', data: data[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// ============================================
// DELETE: ইউজার মুছে ফেলা (শুধু Super Admin, নিজেকে মুছতে পারবে না)
// ============================================
export async function DELETE(request) {
  const user = getCurrentUser(request);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'id is required' }, { status: 400 });
  }
  if (id === user.id) {
    return NextResponse.json({ message: 'You cannot delete your own account' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('admin_users').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: '✅ User deleted!' }, { status: 200 });
}
