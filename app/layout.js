import './globals.css';

export const metadata = {
  title: 'Belal Jamddar Enterprise - Quality Products',
  description: 'Your trusted source for quality products in Bangladesh',
  keywords: 'belal jamddar, enterprise, ecommerce, bangladesh',
  authors: [{ name: 'Belal Jamddar' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ff6600',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        {/* Windows */}
        <meta name="msapplication-TileColor" content="#ff6600" />
        <meta name="msapplication-TileImage" content="/favicon_io/favicon-32x32.png" />

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

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Belal Jamddar Enterprise",
              "url": "https://belal-jamddar-enterprise.vercel.app",
              "description": "Quality products at best prices in Bangladesh",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://belal-jamddar-enterprise.vercel.app?search={search_term_string}",
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
