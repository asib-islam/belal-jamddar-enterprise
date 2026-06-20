// app/sitemap.js
export default async function sitemap() {
  const baseUrl = 'https://belaljamddar.com'; // আপনার ডোমেইন

  // প্রোডাক্ট গুলো API থেকে আনা
  let products = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 } // 1 ঘন্টা পর পর আপডেট
    });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // স্ট্যাটিক পেজ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.1,
    },
  ];

  // ডাইনামিক প্রোডাক্ট পেজ
  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}