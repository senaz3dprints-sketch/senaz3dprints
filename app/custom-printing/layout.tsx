import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Custom 3D Printing Service India | Upload STL & 3D Model Files',
  description:
    'Upload your .stl, .obj, .3mf, .step, or .gcode 3D model files for custom FDM 3D printing in India. High precision manufacturing in PLA, PETG, TPU, ASA, ABS, and Nylon with instant WhatsApp quotes and fast delivery.',
  keywords: [
    'Custom 3D Printing Service India',
    'Upload STL 3D Print Online',
    '3D Printing Price Calculator India',
    'On-demand 3D Printing Service',
    'Rapid Prototyping India',
    'Custom CAD Printing',
    'SenAZ 3D PRINTS Custom',
  ],
  alternates: {
    canonical: 'https://senaz3dprints.in/custom-printing',
  },
  openGraph: {
    title: 'Custom STL 3D Printing Service India | SenAZ 3D PRINTS',
    description:
      'Upload 3D CAD files for custom manufacturing in PLA+, PETG, TPU, and technical polymers with pan-India delivery.',
    url: 'https://senaz3dprints.in/custom-printing',
  },
};

export default function CustomPrintingLayout({ children }: { children: React.ReactNode }) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom 3D Printing & STL Manufacturing Service',
    serviceType: '3D Printing and Rapid Prototyping',
    provider: {
      '@type': 'Organization',
      name: 'SenAZ 3D PRINTS',
      url: 'https://senaz3dprints.in',
    },
    areaServed: 'India',
    description:
      'On-demand FDM 3D printing from STL/OBJ files in PLA, PETG, TPU, ASA, ABS, and Nylon with precision surface inspection.',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '199.00',
      description: 'Starting from ₹199 depending on print hours and material weight.',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
