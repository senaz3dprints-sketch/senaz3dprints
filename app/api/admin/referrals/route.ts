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

    const referrals = await db.referral.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate live orders for each referral code
    const referralsWithLiveOrders = await Promise.all(
      referrals.map(async (ref) => {
        const matchingOrders = await db.order.findMany({
          where: { referralCode: ref.referralCode },
          select: {
            id: true,
            customerName: true,
            whatsapp: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        const liveCount = matchingOrders.length;
        const liveOrderValue = matchingOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);

        return {
          ...ref,
          totalReferrals: Math.max(ref.totalReferrals, liveCount),
          totalOrderValue: Math.max(ref.totalOrderValue, liveOrderValue),
          orders: matchingOrders,
        };
      })
    );

    return NextResponse.json({ referrals: referralsWithLiveOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referrals.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { referralCode, referrerName, referrerContact } = body;

    if (!referralCode || !referrerName) {
      return NextResponse.json({ error: 'Referral Code and Referrer Name are required.' }, { status: 400 });
    }

    const referral = await db.referral.create({
      data: {
        referralCode: referralCode.trim().toUpperCase(),
        referrerName: referrerName.trim(),
        referrerContact: referrerContact ? referrerContact.trim() : null,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, referral });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Referral code already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create referral.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, referrerName, referrerContact } = body;

    if (!id) {
      return NextResponse.json({ error: 'Referral ID required.' }, { status: 400 });
    }

    const updated = await db.referral.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(referrerName && { referrerName: referrerName.trim() }),
        ...(referrerContact !== undefined && { referrerContact }),
      },
    });

    return NextResponse.json({ success: true, referral: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update referral.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Referral ID required.' }, { status: 400 });
    }

    await db.referral.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete referral.' }, { status: 500 });
  }
}
