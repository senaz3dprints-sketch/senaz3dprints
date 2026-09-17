import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getShippingSettings } from '@/lib/shipping';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const settings = await getShippingSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping settings.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const flatRate = Math.max(0, Number(body.flatRate) || 0);
    const freeShippingThreshold = Math.max(0, Number(body.freeShippingThreshold) || 0);
    const shippingNote = (body.shippingNote || '').trim() || 'Standard delivery in 3-5 business days across India';

    const payload = {
      flatRate,
      freeShippingThreshold,
      shippingNote,
    };

    const updated = await db.siteContent.upsert({
      where: { key: 'shipping' },
      update: { content: JSON.stringify(payload) },
      create: { key: 'shipping', content: JSON.stringify(payload) },
    });

    return NextResponse.json({ success: true, settings: JSON.parse(updated.content) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shipping settings.' }, { status: 500 });
  }
}
