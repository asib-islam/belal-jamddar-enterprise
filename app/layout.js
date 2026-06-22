import './globals.css';

export const metadata = {
  // ===== BASIC META TAGS =====
  title: {
    default: 'Belal Jamddar Enterprise',
    template: '%s | Belal Jamddar Enterprise'
  },
  description: 'Your trusted source for quality products in Bangladesh. Shop online for best prices, fast delivery, and secure payment.',
  keywords: ['belal jamddar', 'belal', 'enterprise', 'ecommerce', 'bangladesh', 'online shop', 'quality products', 'dhaka', 'saver', 'kathgara', ],
  authors: [{ name: 'Belal Jamddar' }],
  creator: 'Belal Jamddar',
  publisher: 'Belal Jamddar Enterprise',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ===== OPEN GRAPH (Facebook, WhatsApp, LinkedIn) =====
  openGraph: {
    title: 'Belal Jamddar Enterprise ',
    description: 'Your trusted source for quality products in Bangladesh. Shop now!',
    url: 'https://belal-jamddar-enterprise.vercel.app',
    siteName: 'Belal Jamddar Enterprise',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Belal Jamddar Enterprise',
      },
    ],
    type: 'website',
    locale: 'bn_BD',
  },

  // ===== TWITTER CARDS =====
  twitter: {
    card: 'summary_large_image',
    title: 'Belal Jamddar Enterprise - Quality Products',
    description: 'Your trusted source for quality products in Bangladesh.',
    images: ['/logo.png'],
  },

  // ===== OTHER =====
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'yes',
  },
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
  category: 'ecommerce',
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