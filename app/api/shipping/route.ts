import { NextResponse } from 'next/server';
import { getShippingSettings } from '@/lib/shipping';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getShippingSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping settings' }, { status: 500 });
  }
}
