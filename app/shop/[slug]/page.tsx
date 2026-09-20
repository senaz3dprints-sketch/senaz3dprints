import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

// Helper to resolve product with multi-strategy lookup
async function getProductBySlug(rawSlug: string) {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch (e) {}

  const normalizedSlug = decodedSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    // 1. Exact, normalized or name match
    let product = await db.product.findFirst({
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

    // 2. Fuzzy match
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

    // 3. Token word fallback
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

    return product;
  } catch (e) {
    console.error('Error fetching product for SEO:', e);
    return null;
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const rawSlug = params?.slug ? String(params.slug) : '';
  const product = await getProductBySlug(rawSlug);

  if (!product || !product.isPublished) {
    return {
      title: 'Product Not Found | SenAZ 3D PRINTS',
      description: 'The requested 3D printed product could not be found.',
    };
  }

  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    images = [product.images as unknown as string];
  }
  const mainImage = images[0] || 'https://senaz3dprints.in/images/senaz_3d_printer_hero.jpg';

  const productTitle = `${product.name} | SenAZ 3D PRINTS`;
  const productDesc = `${product.shortDescription || product.name}. Material: ${product.material}. High-precision 3D printed in India. Price: ₹${product.price}. Fast pan-India delivery.`;

  return {
    title: productTitle,
    description: productDesc,
    keywords: [
      product.name,
      `${product.name} 3D Print`,
      'Custom 3D Printing India',
      product.category?.name || '3D Prints',
      'SenAZ 3D PRINTS',
      product.material,
    ],
    alternates: {
      canonical: `https://senaz3dprints.in/shop/${encodeURIComponent(product.slug)}`,
    },
    openGraph: {
      title: productTitle,
      description: productDesc,
      url: `https://senaz3dprints.in/shop/${encodeURIComponent(product.slug)}`,
      siteName: 'SenAZ 3D PRINTS',
      type: 'website',
      images: [
        {
          url: mainImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDesc,
      images: [mainImage],
      creator: '@senaz3dprints',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const rawSlug = params?.slug ? String(params.slug) : '';
  const product = await getProductBySlug(rawSlug);

  if (!product || !product.isPublished) {
    notFound();
  }

  let relatedProducts: any[] = [];
  try {
    relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true,
      },
      take: 3,
    });
  } catch (e) {}

  // Parse images for structured data
  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    images = [product.images as unknown as string];
  }

  // Schema.org Product JSON-LD Structured Data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.shortDescription || product.fullDescription,
    sku: product.slug,
    category: product.category?.name,
    material: product.material,
    brand: {
      '@type': 'Brand',
      name: 'SenAZ 3D PRINTS',
    },
    offers: {
      '@type': 'Offer',
      url: `https://senaz3dprints.in/shop/${encodeURIComponent(product.slug)}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stockStatus === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SenAZ 3D PRINTS',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://senaz3dprints.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://senaz3dprints.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://senaz3dprints.in/shop/${encodeURIComponent(product.slug)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
