import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { syncReceiptSheetRecord } from '@/lib/google-sheets';

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const receipts = await db.receipt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ receipts });
  } catch (error) {
    console.error('Failed to fetch receipts:', error);
    return NextResponse.json({ error: 'Failed to fetch receipts.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const data = await req.json();
    const {
      id,
      receiptNumber,
      docType,
      customerName,
      whatsapp,
      email,
      address,
      city,
      state,
      pincode,
      customerNotes,
      adminBusinessInfo,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      taxPercent,
      grandTotal,
      advancePaid,
      balanceDue,
      paymentStatus,
      paymentMode,
      upiId,
      estimatedDelivery,
      issueDate,
    } = data;

    if (!receiptNumber || !customerName) {
      return NextResponse.json(
        { error: 'Receipt number and customer name are required.' },
        { status: 400 }
      );
    }

    const payload = {
      receiptNumber,
      docType: docType || 'INVOICE',
      customerName,
      whatsapp: whatsapp || '',
      email: email || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      customerNotes: customerNotes || '',
      adminBusinessInfo:
        typeof adminBusinessInfo === 'object'
          ? JSON.stringify(adminBusinessInfo)
          : adminBusinessInfo || '',
      items: typeof items === 'object' ? JSON.stringify(items) : items || '[]',
      subtotal: Number(subtotal) || 0,
      discountAmount: Number(discountAmount) || 0,
      shippingFee: Number(shippingFee) || 0,
      taxPercent: Number(taxPercent) || 0,
      grandTotal: Number(grandTotal) || 0,
      advancePaid: Number(advancePaid) || 0,
      balanceDue: Number(balanceDue) || 0,
      paymentStatus: paymentStatus || 'PAID_IN_FULL',
      paymentMode: paymentMode || 'UPI / Online',
      upiId: upiId || '918761053230@upi',
      estimatedDelivery: estimatedDelivery || '3-5 Business Days',
      issueDate: issueDate || new Date().toISOString().split('T')[0],
    };

    let saved;
    if (id) {
      // Update existing
      saved = await db.receipt.update({
        where: { id },
        data: payload,
      });
    } else {
      // Upsert by receiptNumber
      saved = await db.receipt.upsert({
        where: { receiptNumber },
        update: payload,
        create: payload,
      });
    }

    try {
      await syncReceiptSheetRecord({
        receiptNumber: saved.receiptNumber,
        docType: saved.docType,
        customerName: saved.customerName,
        whatsapp: saved.whatsapp,
        email: saved.email,
        address: saved.address,
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
        items: saved.items,
        subtotal: saved.subtotal,
        discountAmount: saved.discountAmount,
        shippingFee: saved.shippingFee,
        grandTotal: saved.grandTotal,
        advancePaid: saved.advancePaid,
        balanceDue: saved.balanceDue,
        paymentStatus: saved.paymentStatus,
        paymentMode: saved.paymentMode,
        customerNotes: saved.customerNotes,
        issueDate: saved.issueDate,
      });
    } catch (sheetErr) {
      console.error('[Google Sheets Receipt Sync Error]', sheetErr);
    }

    return NextResponse.json({ success: true, receipt: saved });
  } catch (error) {
    console.error('Failed to save receipt:', error);
    return NextResponse.json({ error: 'Failed to save receipt.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Receipt ID required.' }, { status: 400 });
    }

    await db.receipt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete receipt:', error);
    return NextResponse.json({ error: 'Failed to delete receipt.' }, { status: 500 });
  }
}
