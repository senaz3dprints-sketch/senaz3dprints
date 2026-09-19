import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import ShopClient from './ShopClient';

export const revalidate = 60;

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
