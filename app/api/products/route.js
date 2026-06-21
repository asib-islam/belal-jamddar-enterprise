import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySessionToken } from '../../../lib/auth';

// Supabase কানেকশন
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// GET: সব প্রোডাক্ট আনা
// ============================================
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// ============================================
// POST: নতুন প্রোডাক্ট যোগ করা
// ============================================
export async function POST(request) {
  try {
    // অ্যাডমিন চেক
    const session = request.cookies.get('admin_session');
    if (!verifySessionToken(session?.value)) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const { title, description, price, images, category } = await request.json();

    // ভ্যালিডেশন
    if (!title || !description || !price) {
      return NextResponse.json(
        { message: 'Title, description and price are required' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: 'At least one image is required' },
        { status: 400 }
      );
    }

    // ডাটাবেজে সেভ
    const { data, error } = await supabase
      .from('products')
      .insert([{
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        images: images,
        image: images[0] || '',
        category: category?.trim() || 'Uncategorized',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json(
        { message: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: '✅ Product added successfully!', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PUT: প্রোডাক্ট আপডেট করা (Edit)
// ============================================
export async function PUT(request) {
  try {
    // অ্যাডমিন চেক
    const session = request.cookies.get('admin_session');
    if (!verifySessionToken(session?.value)) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const { id, title, description, price, images, category } = await request.json();

    // আইডি চেক
    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // আপডেট ডাটা তৈরি
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (price) updateData.price = price.trim();
    if (category) updateData.category = category.trim();

    if (images && Array.isArray(images) && images.length > 0) {
      updateData.images = images;
      updateData.image = images[0];
    }

    // ডাটাবেজ আপডেট
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Update Error:', error);
      return NextResponse.json(
        { message: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: '✅ Product updated successfully!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE: প্রোডাক্ট ডিলিট করা
// ============================================
export async function DELETE(request) {
  try {
    // অ্যাডমিন চেক
    const session = request.cookies.get('admin_session');
    if (!verifySessionToken(session?.value)) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // আইডি নেওয়া
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // ডাটাবেজ থেকে ডিলিট
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      return NextResponse.json(
        { message: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: '✅ Product deleted successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
