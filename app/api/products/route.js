import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== GET: সব প্রোডাক্ট =====
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

// ===== POST: নতুন প্রোডাক্ট =====
export async function POST(request) {
  try {
    // অ্যাডমিন চেক (সফট)
    const session = request.cookies.get('admin_session');
    // যদি লগইন না থাকে, তবুও যোগ করতে দিন (ডেমো)
    // if (!session || session.value !== 'authenticated') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { title, description, price, images, category } = await request.json();

    if (!title || !description || !price || !images?.length) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price.toString().replace(/,/g, '')),
        images: images,
        image: images[0] || '',
        category: category?.trim() || 'Uncategorized'
      }])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product added successfully!', data }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// ===== PUT: প্রোডাক্ট আপডেট =====
export async function PUT(request) {
  try {
    const session = request.cookies.get('admin_session');
    // if (!session || session.value !== 'authenticated') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { id, title, description, price, images, category } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (price) updateData.price = parseFloat(price.toString().replace(/,/g, ''));
    if (category) updateData.category = category.trim();
    if (images && Array.isArray(images) && images.length > 0) {
      updateData.images = images;
      updateData.image = images[0];
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', parseInt(id))
      .select();

    if (error) {
      console.error('Supabase Update Error:', error);
      return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully!', data }, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// ===== DELETE: প্রোডাক্ট ডিলিট =====
export async function DELETE(request) {
  try {
    const session = request.cookies.get('admin_session');
    // if (!session || session.value !== 'authenticated') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase Delete Error:', error);
      return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
