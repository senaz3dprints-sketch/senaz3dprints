import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import ShopClient from './ShopClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop 3D Printed Products, Keychains & Statues',
  description:
    'Browse our full collection of precision 3D printed items in India. Personalized name keychains, desk toys, low-poly decor, and anime figures in PLA+ and PETG.',
  alternates: {
    canonical: 'https://senaz3dprints.in/shop',
  },
  openGraph: {
    title: 'Shop 3D Printed Products & Custom Gifts | SenAZ 3D PRINTS',
    description:
      'Browse precision 3D printed keychains, decor, and figures crafted with industrial FDM printers in India.',
    url: 'https://senaz3dprints.in/shop',
  },
};

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    db.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }).catch(() => []),
    db.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        images: true,
        material: true,
        colors: true,
        isFeatured: true,
        isNew: true,
        personalizationEnabled: true,
        shippingFee: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    }).catch(() => []),
  ]);

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading catalog...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
