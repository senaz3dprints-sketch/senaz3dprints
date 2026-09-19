import { NextRequest, NextResponse } from 'next/server';
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

    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, image, displayOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if category name or slug already exists
    const existing = await db.category.findFirst({
      where: {
        OR: [{ name: cleanName }, { slug: cleanSlug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A category with name "${cleanName}" or slug "${cleanSlug}" already exists.` },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        name: cleanName,
        slug: cleanSlug,
        description: description ? description.trim() : null,
        image: image ? image.trim() : null,
        displayOrder: parseInt(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, description, image, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check conflict with other category
    const existing = await db.category.findFirst({
      where: {
        id: { not: id },
        OR: [{ name: cleanName }, { slug: cleanSlug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Another category with name "${cleanName}" or slug "${cleanSlug}" already exists.` },
        { status: 400 }
      );
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: cleanName,
        slug: cleanSlug,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        image: image !== undefined ? (image ? image.trim() : null) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) || 0 : undefined,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
    }

    // Check if category has products
    const productCount = await db.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category because it has ${productCount} assigned product(s). Please reassign or delete the products first.`,
        },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
