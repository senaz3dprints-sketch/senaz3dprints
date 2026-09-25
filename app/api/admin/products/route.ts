import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { syncProductSheetRecord } from '@/lib/google-sheets';
import { normalizeImageUrl, parseImageList } from '@/lib/images';

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
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
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
      return NextResponse.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
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
      shippingFee,
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

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Please select a product category.' }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: 'Please provide a valid price (₹).' }, { status: 400 });
    }

    // Generate unique slug
    let generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!generatedSlug) {
      generatedSlug = `product-${Date.now()}`;
    }

    // Avoid duplicate slug collisions
    const existingSlug = await db.product.findUnique({ where: { slug: generatedSlug } });
    if (existingSlug) {
      generatedSlug = `${generatedSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Normalize image URLs
    const normalizedImageList = parseImageList(images);

    const product = await db.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription?.trim() || name.trim(),
        fullDescription: fullDescription?.trim() || shortDescription?.trim() || name.trim(),
        categoryId,
        price: parsedPrice,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        shippingFee: shippingFee !== undefined && shippingFee !== '' ? parseFloat(shippingFee) : 0,
        images: JSON.stringify(normalizedImageList),
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
      const cat = await db.category.findUnique({ where: { id: categoryId } });
      await syncProductSheetRecord({
        name: product.name,
        categoryName: cat?.name || 'General',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        images: normalizedImageList,
        colors: Array.isArray(colors) ? colors : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        material: product.material,
        stockQuantity: product.stockQuantity,
        personalizationEnabled: product.personalizationEnabled,
        tags: Array.isArray(tags) ? tags : [],
      });
    } catch (sheetErr) {
      console.error('[Google Sheets Product Sync Error]', sheetErr);
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product.' }, { status: 500 });
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

    if (data.slug) {
      data.slug = data.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const existing = await db.product.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (existing) {
        data.slug = `${data.slug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    if (data.price !== undefined) data.price = parseFloat(data.price) || 0;
    if (data.compareAtPrice !== undefined) data.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
    if (data.shippingFee !== undefined) data.shippingFee = data.shippingFee !== '' && data.shippingFee !== null ? parseFloat(data.shippingFee) : 0;
    if (data.stockQuantity !== undefined) data.stockQuantity = parseInt(data.stockQuantity) || 0;
    if (data.images) data.images = JSON.stringify(parseImageList(data.images));
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
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product.' }, { status: 500 });
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
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product.' }, { status: 500 });
  }
}
