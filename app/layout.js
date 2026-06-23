import './globals.css';
import Script from 'next/script';

export const metadata = {
  // ✅ এটা অবশ্যই লাগবে
  metadataBase: new URL('https://belal-jamaddar-enterprise.vercel.app'),

  title: {
    default: 'Belal Jamddar Enterprise',
    template: '%s | Belal Jamaddar Enterprise'
  },
  description: 'trusted source for quality products in Bangladesh.',
  keywords: ['belal jamaddar', 'enterprise', 'ecommerce', 'bangladesh', 'saver', 'dhaka', 'ar jeans', 'shop'],
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


  openGraph: {
    title: 'Belal Jamaddar Enterprise',
    description: 'Your trusted source for quality products in Bangladesh.',
    url: 'https://belal-jamaddar-enterprise.vercel.app',
    siteName: 'Belal Jamaddar Enterprise',
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'bn_BD',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Belal Jamaddar Enterprise',
    description: 'Your trusted source for quality products in Bangladesh.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        {/* ✅ শুধু favicon গুলো রাখুন */}
        <link rel="icon" href="/favicon_io/favicon.ico" />
        <link rel="icon" href="/favicon_io/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />

        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Belal Jamaddar Enterprise",
              "url": "https://belal-jamaddar-enterprise.vercel.app",
            })
          }}
        />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WME95KNT3M" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WME95KNT3M');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}