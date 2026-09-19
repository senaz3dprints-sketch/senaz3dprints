import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product = null;
  let relatedProducts: any[] = [];

  try {
    product = await db.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });

    if (product) {
      relatedProducts = await db.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isPublished: true,
        },
        take: 3,
      });
    }
  } catch (e) {
    console.error('ProductDetailPage DB fetch error:', e);
  }

  if (!product || !product.isPublished) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
