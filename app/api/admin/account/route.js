import { NextResponse } from 'next/server';
import { verifySessionToken, comparePassword, hashPassword } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

// ============================================
// PUT: নিজের email/password আপডেট (নিজের current password verify করে)
// ============================================
export async function PUT(request) {
  try {
    const session = request.cookies.get('admin_session');
    const user = verifySessionToken(session?.value);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json({ message: 'Current password is required' }, { status: 400 });
    }

    const { data: dbUser, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError || !dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const valid = await comparePassword(currentPassword, dbUser.password_hash);
    if (!valid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    const updateData = {};

    if (newEmail && newEmail.trim().toLowerCase() !== dbUser.email) {
      updateData.email = newEmail.trim().toLowerCase();
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ message: 'New password must be at least 8 characters' }, { status: 400 });
      }
      updateData.password_hash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from('admin_users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ message: 'This email is already in use' }, { status: 409 });
      }
      return NextResponse.json({ message: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: '✅ Account updated! Please login again.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
