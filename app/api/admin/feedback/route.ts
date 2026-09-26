import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const feedbacks = await db.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Admin feedback fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback list' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, roleOrCity, rating, comment, isApproved } = body;

    if (!customerName?.trim() || !comment?.trim()) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const created = await db.feedback.create({
      data: {
        customerName: customerName.trim(),
        roleOrCity: roleOrCity?.trim() || 'Verified Buyer',
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        comment: comment.trim(),
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      },
    });

    return NextResponse.json({ success: true, feedback: created });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isApproved, customerName, roleOrCity, rating, comment } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await db.feedback.update({
      where: { id },
      data: {
        ...(isApproved !== undefined && { isApproved: Boolean(isApproved) }),
        ...(customerName && { customerName: customerName.trim() }),
        ...(roleOrCity !== undefined && { roleOrCity: roleOrCity.trim() }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(1, parseInt(rating) || 5)) }),
        ...(comment && { comment: comment.trim() }),
      },
    });

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.feedback.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
