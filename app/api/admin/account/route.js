// app/api/admin/account/route.js
import { NextResponse } from 'next/server';
import { hashPassword, comparePassword, verifySessionToken } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function PUT(request) {
  try {
    // সেশন চেক
    const session = request.cookies.get('admin_session');
    const user = verifySessionToken(session?.value);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await request.json();

    // বর্তমান ইউজার ডাটা আনা
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Current password verify
    const isValid = await comparePassword(currentPassword, existingUser.password_hash);
    if (!isValid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    // আপডেট ডাটা প্রস্তুত
    const updateData = {};
    if (newEmail) {
      // Email ইউনিক কিনা চেক
      const { data: emailCheck } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('email', newEmail)
        .neq('id', user.id)
        .single();

      if (emailCheck) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
      }
      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.password_hash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No changes to update' }, { status: 400 });
    }

    // ডাটাবেজ আপডেট
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('admin_users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Account updated successfully! Please login again.',
      user: { id: updated.id, email: updated.email, name: updated.name }
    }, { status: 200 });

  } catch (error) {
    console.error('Account update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}