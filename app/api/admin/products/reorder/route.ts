import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'orderedIds array is required.' }, { status: 400 });
    }

    // Execute batch update in transaction
    const updatePromises = orderedIds.map((id: string, index: number) =>
      db.product.update({
        where: { id },
        data: { displayOrder: index + 1 },
      })
    );

    await db.$transaction(updatePromises);

    // Instant site-wide cache revalidation
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/admin/products');
      revalidatePath('/admin/dashboard');
    } catch (e) {}

    return NextResponse.json({ success: true, count: orderedIds.length });
  } catch (error) {
    console.error('Reorder products error:', error);
    return NextResponse.json({ error: 'Failed to reorder products.' }, { status: 500 });
  }
}
