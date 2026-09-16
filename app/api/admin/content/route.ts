import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const siteContent = await db.siteContent.findUnique({
      where: { key: 'homepage' },
    });

    const parsed = siteContent ? JSON.parse(siteContent.content) : null;
    return NextResponse.json({ content: parsed });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch site content.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db.siteContent.upsert({
      where: { key: 'homepage' },
      update: { content: JSON.stringify(body) },
      create: { key: 'homepage', content: JSON.stringify(body) },
    });

    return NextResponse.json({ success: true, content: JSON.parse(updated.content) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update site content.' }, { status: 500 });
  }
}
