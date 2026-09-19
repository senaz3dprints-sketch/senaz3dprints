import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product = null;
  let relatedProducts: any[] = [];

  const rawSlug = params?.slug ? String(params.slug) : '';
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch (e) {}

  const normalizedSlug = decodedSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    // Multi-strategy lookup: exact slug, decoded slug, normalized slug, or case-insensitive name
    product = await db.product.findFirst({
      where: {
        OR: [
          { slug: rawSlug },
          { slug: decodedSlug },
          { slug: { equals: rawSlug, mode: 'insensitive' } },
          { slug: { equals: decodedSlug, mode: 'insensitive' } },
          { slug: normalizedSlug },
          { name: { equals: decodedSlug, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
    });

    // If still not found, try fuzzy match on name/slug
    if (!product) {
      product = await db.product.findFirst({
        where: {
          OR: [
            { slug: { contains: normalizedSlug, mode: 'insensitive' } },
            { name: { contains: decodedSlug, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
      });
    }

    // Token word fallback for legacy partial slugs
    if (!product) {
      const words = decodedSlug.split(/[\s-_]+/).filter((w) => w.length > 2);
      if (words.length > 0) {
        product = await db.product.findFirst({
          where: {
            OR: [
              ...words.map((w) => ({ name: { contains: w, mode: 'insensitive' as const } })),
              ...words.map((w) => ({ slug: { contains: w, mode: 'insensitive' as const } })),
            ],
          },
          include: { category: true },
        });
      }
    }

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
