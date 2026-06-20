import './globals.css';

export const metadata = {
  title: 'Belal Jamddar Enterprise - Quality Products',
  description: 'Your trusted source for quality products in Bangladesh',
  keywords: 'belal jamddar, enterprise, ecommerce, bangladesh',
  authors: [{ name: 'Belal Jamddar' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#ff6600',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Android */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ff6600" />
        
        {/* Windows */}
        <meta name="msapplication-TileColor" content="#ff6600" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        
        {/* Social Media */}
        <meta property="og:title" content="Belal Jamddar Enterprise" />
        <meta property="og:description" content="Your trusted source for quality products in Bangladesh" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Belal Jamddar Enterprise" />
        <meta name="twitter:description" content="Your trusted source for quality products" />
        <meta name="twitter:image" content="/logo.png" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <meta charSet="UTF-8" />
        
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Belal Jamddar Enterprise",
      "url": "https://belaljamddarenterprise.com",
      "description": "Quality products at best prices in Bangladesh",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://belaljamddarenterprise.com?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })
  }}
/>


      </head>
      <body>
        {children}
      </body>
    </html>
  );
}