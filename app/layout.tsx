import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'SENAZ 3D PRINTS | Custom 3D Printed Products & STL Printing Service India',
  description:
    'Custom 3D printed keychains, personalised name products, character figures, desk accessories, and custom 3D printing STL service in India. High precision FDM & Resin manufacturing.',
  metadataBase: new URL('https://senaz3dprints.in'),
  keywords: [
    '3D Printing India',
    'Custom Keychains',
    'Personalized 3D Prints',
    'SENAZ 3D PRINTS',
    'STL Printing Service',
    '3D Printed Statues',
    'Desk Accessories',
  ],
  openGraph: {
    title: 'SENAZ 3D PRINTS | Made to Print. Built for You.',
    description:
      'Personalised keychains, desk accessories, low-poly statues and custom 3D model printing.',
    url: 'https://senaz3dprints.in',
    siteName: 'SENAZ 3D PRINTS',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-tech-bg text-slate-100 font-sans">
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
