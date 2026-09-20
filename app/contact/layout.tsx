import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact Us & WhatsApp Support | SenAZ 3D PRINTS',
  description:
    'Get in touch with SenAZ 3D PRINTS. Direct WhatsApp support at +91 87610 53230 for custom 3D printing orders, file inquiries, bulk corporate gifts, and order tracking.',
  alternates: {
    canonical: 'https://senaz3dprints.in/contact',
  },
  openGraph: {
    title: 'Contact SenAZ 3D PRINTS | WhatsApp Support & Custom Inquiries',
    description:
      'Contact our 3D printing lab for custom prints, model file quotations, and personalized orders in India.',
    url: 'https://senaz3dprints.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
