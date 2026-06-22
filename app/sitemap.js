// app/sitemap.js
export default async function sitemap() {
  const baseUrl = 'https://belal-jamaddar-enterprise.vercel.app'; // ← এই লিংক দিন
  
  let products = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
