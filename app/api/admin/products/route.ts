import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const products = await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await db.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ products, categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      categoryId,
      price,
      compareAtPrice,
      images,
      colors,
      sizes,
      material,
      weight,
      dimensions,
      stockQuantity,
      stockStatus,
      isFeatured,
      isNew,
      isPublished,
      personalizationEnabled,
      customTextEnabled,
      tags,
    } = body;

    if (!name || !categoryId || !price) {
      return NextResponse.json({ error: 'Name, Category, and Price are required.' }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const product = await db.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription || '',
        fullDescription: fullDescription || '',
        categoryId,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors || []),
        sizes: typeof sizes === 'string' ? sizes : JSON.stringify(sizes || []),
        material: material || 'PLA+',
        weight: weight || '',
        dimensions: dimensions || '',
        stockQuantity: parseInt(stockQuantity) || 0,
        stockStatus: stockStatus || 'IN_STOCK',
        isFeatured: !!isFeatured,
        isNew: !!isNew,
        isPublished: isPublished !== undefined ? !!isPublished : true,
        personalizationEnabled: !!personalizationEnabled,
        customTextEnabled: !!customTextEnabled,
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
      },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required.' }, { status: 400 });
    }

    if (data.price) data.price = parseFloat(data.price);
    if (data.compareAtPrice) data.compareAtPrice = parseFloat(data.compareAtPrice);
    if (data.stockQuantity !== undefined) data.stockQuantity = parseInt(data.stockQuantity);
    if (data.images && typeof data.images !== 'string') data.images = JSON.stringify(data.images);
    if (data.colors && typeof data.colors !== 'string') data.colors = JSON.stringify(data.colors);
    if (data.sizes && typeof data.sizes !== 'string') data.sizes = JSON.stringify(data.sizes);
    if (data.tags && typeof data.tags !== 'string') data.tags = JSON.stringify(data.tags);

    const updated = await db.product.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath(`/shop/${updated.slug}`);
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required.' }, { status: 400 });
    }

    const deleted = await db.product.delete({ where: { id } });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      if (deleted?.slug) revalidatePath(`/shop/${deleted.slug}`);
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
