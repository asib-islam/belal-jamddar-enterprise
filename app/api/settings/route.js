// app/api/settings/route.js
import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

// ===== GET: Settings আনা =====
export async function GET(request) {
  try {
    const session = request.cookies.get('admin_session');
    const user = verifySessionToken(session?.value);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Fetch error:', error);
      return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 });
    }

    // যদি ডাটা না থাকে, ডিফল্ট রিটার্ন
    return NextResponse.json(data || {
      storeName: 'Belal Jamaddar Enterprise',
      storeEmail: 'belaljamaddarenterprise@gmail.com',
      storePhone: '01581427849',
      storeAddress: 'Your Store Address',
      currency: 'BDT',
      whatsappNumber: '01581427849'
    }, { status: 200 });

  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ===== PUT: Settings আপডেট =====
export async function PUT(request) {
  try {
    const session = request.cookies.get('admin_session');
    const user = verifySessionToken(session?.value);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { storeName, storeEmail, storePhone, storeAddress, currency, whatsappNumber } = await request.json();

    // ডাটা চেক
    const settingsData = {
      store_name: storeName,
      store_email: storeEmail,
      store_phone: storePhone,
      store_address: storeAddress,
      currency: currency || 'BDT',
      whatsapp_number: whatsappNumber,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    };

    // Upsert (insert or update)
    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .upsert(settingsData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Upsert error:', error);
      return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({
      message: '✅ Settings saved successfully!',
      data
    }, { status: 200 });

  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}