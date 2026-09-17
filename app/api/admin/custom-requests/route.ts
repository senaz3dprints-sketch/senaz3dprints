import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { updateCustomRequestStatusSheetRecord } from '@/lib/google-sheets';

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const requests = await db.customRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch custom requests.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Request ID and status required.' }, { status: 400 });
    }

    const updated = await db.customRequest.update({
      where: { id },
      data: { status },
    });

    // Synchronously update Google Sheet tab 'CustomRequests' and notify customer
    try {
      await updateCustomRequestStatusSheetRecord(id, status, {
        customerName: updated.customerName,
        customerEmail: updated.email,
        whatsapp: updated.whatsapp,
        productType: updated.productType,
      });
    } catch (sheetErr) {
      console.error('[Admin Custom Request Sheet Sync Error]', sheetErr);
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update custom request status.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Request ID required.' }, { status: 400 });
    }

    await db.customRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete custom request.' }, { status: 500 });
  }
}
