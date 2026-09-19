import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  let categories: any[] = [];
  let products: any[] = [];

  try {
    categories = await db.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    products = await db.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (e) {
    console.error('ShopPage DB fetch error:', e);
  }

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading catalog...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
