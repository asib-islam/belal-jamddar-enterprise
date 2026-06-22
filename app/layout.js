import './globals.css';

export const metadata = {
  // ===== BASIC META TAGS =====
  title: {
    default: 'Belal Jamddar Enterprise',
    template: '%s | Belal Jamaddar Enterprise'
  },
  description: 'Your trusted source for quality products in Bangladesh. Shop online for best prices, fast delivery, and secure payment.',
  keywords: ['belal jamaddar', 'belal', 'enterprise', 'ecommerce', 'bangladesh', 'online shop', 'quality products', 'dhaka', 'ashulia', 'saver', 'kathgara'],
  authors: [{ name: 'Belal Jamaddar' }],
  creator: 'Belal Jamaddar',
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
    title: 'Belal Jamaddar Enterprise',
    description: 'Your trusted source for quality products in Bangladesh. Shop now!',
    url: 'https://belal-jamaddar-enterprise.vercel.app',
    siteName: 'Belal Jamaddar Enterprise',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Belal Jamaddar Enterprise',
      },
    ],
    type: 'website',
    locale: 'bn_BD',
  },

  // ===== TWITTER CARDS =====
  twitter: {
    card: 'summary_large_image',
    title: 'Belal Jamaddar Enterprise - Quality Products',
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
  category: 'ecommerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        {/* ===== FAVICON - সব ব্রাউজারের জন্য ===== */}
        <link rel="icon" href="/favicon_io/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" type="image/x-icon" />
        
        {/* ===== FAVICON - PNG (Chrome, Firefox, Edge) ===== */}
        <link rel="icon" href="/favicon_io/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon_io/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon_io/favicon-48x48.png" type="image/png" sizes="48x48" />
        
        {/* ===== APPLE DEVICES (iPhone, iPad, Mac) ===== */}
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon_io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        
        {/* ===== ANDROID / CHROME ===== */}
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <link rel="mask-icon" href="/favicon_io/favicon.ico" color="#ff6600" />
        <meta name="theme-color" content="#ff6600" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* ===== WINDOWS ===== */}
        <meta name="msapplication-TileColor" content="#ff6600" />
        <meta name="msapplication-TileImage" content="/favicon_io/favicon-32x32.png" />
        <meta name="msapplication-config" content="/favicon_io/browserconfig.xml" />

        {/* ===== SOCIAL MEDIA ===== */}
        <meta property="og:title" content="Belal Jamddar Enterprise" />
        <meta property="og:description" content="Your trusted source for quality products in Bangladesh" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://belal-jamddar-enterprise.vercel.app" />
        <meta property="og:site_name" content="Belal Jamddar Enterprise" />
        <meta property="og:locale" content="bn_BD" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Belal Jamddar Enterprise" />
        <meta name="twitter:description" content="Your trusted source for quality products" />
        <meta name="twitter:image" content="/logo.png" />

        {/* ===== VIEWPORT ===== */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <meta charSet="UTF-8" />

        {/* ===== FONT AWESOME CDN ===== */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        {/* ===== SCHEMA MARKUP ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Belal Jamaddar Enterprise",
              "url": "https://belal-jamaddar-enterprise.vercel.app",
              "description": "Quality products at best prices in Bangladesh",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://belal-jamaddar-enterprise.vercel.app?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* ===== BING VERIFICATION (ঐচ্ছিক) ===== */}
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}