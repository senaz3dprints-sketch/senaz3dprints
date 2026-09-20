import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import TopProgressBar from '@/components/TopProgressBar';

export const viewport: Viewport = {
  themeColor: '#00e5ff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://senaz3dprints.in'),
  title: {
    default: 'SenAZ 3D PRINTS | Custom 3D Printed Products & STL Printing Service India',
    template: '%s | SenAZ 3D PRINTS',
  },
  description:
    'SenAZ 3D PRINTS is India\'s premier 3D print lab. Buy custom personalized name keychains, low-poly statues, desk accessories, and order on-demand custom STL 3D printing in PLA+, PETG, TPU, ABS, and Nylon with fast pan-India shipping.',
  keywords: [
    '3D Printing India',
    'Custom 3D Printing Service India',
    'Personalized Keychains India',
    'Custom Name 3D Keychain',
    'STL 3D Print Online India',
    '3D Printed Statues & Figures',
    'SenAZ 3D PRINTS',
    '3D Print Shop India',
    'Customized 3D Gifts',
    'Rapid Prototyping India',
    'PLA PETG TPU 3D Printing',
    'Desk Accessories 3D Print',
  ],
  authors: [{ name: 'SenAZ 3D PRINTS', url: 'https://senaz3dprints.in' }],
  creator: 'SenAZ 3D PRINTS',
  publisher: 'SenAZ 3D PRINTS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://senaz3dprints.in',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/logo-icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/images/logo-icon.png' },
    ],
  },
  openGraph: {
    title: 'SenAZ 3D PRINTS | Made to Print. Built for You.',
    description:
      'Buy personalized 3D printed keychains, custom statues, desk accessories, or upload your own 3D model STL files for precision printing in India.',
    url: 'https://senaz3dprints.in',
    siteName: 'SenAZ 3D PRINTS',
    images: [
      {
        url: '/images/senaz_3d_printer_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'SenAZ 3D PRINTS Precision Manufacturing Studio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SenAZ 3D PRINTS | Custom 3D Printed Products & STL Printing',
    description:
      'Custom 3D printed keychains, personalized gifts, figures, and online STL printing service in India.',
    images: ['/images/senaz_3d_printer_hero.jpg'],
    creator: '@senaz3dprints',
  },
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
  category: 'ecommerce',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema.org Structured Data (JSON-LD) for Google Rich Snippets & Indexing
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'SenAZ 3D PRINTS',
    url: 'https://senaz3dprints.in',
    logo: 'https://senaz3dprints.in/images/logo-full.png',
    image: 'https://senaz3dprints.in/images/senaz_3d_printer_hero.jpg',
    description:
      'Premier custom 3D printing studio in India offering personalized keychains, desk decor, anime figures, and custom STL 3D printing services.',
    telephone: '+918761053230',
    email: 'senaz3dprints@gmail.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://senaz3dprints.in/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://instagram.com/senaz3dprints',
      'https://wa.me/918761053230',
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-tech-bg text-slate-100 font-sans antialiased">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
