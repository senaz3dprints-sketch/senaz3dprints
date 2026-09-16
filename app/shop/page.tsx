import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import ShopClient from './ShopClient';

export const revalidate = 0;

export default async function ShopPage() {
  const categories = await db.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const products = await db.product.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading catalog...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
