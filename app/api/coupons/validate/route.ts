import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check Coupon in Database
    const coupon = await db.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (coupon && coupon.isActive) {
      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return NextResponse.json({ error: 'This coupon code has expired.' }, { status: 400 });
      }

      if (coupon.timesUsed >= coupon.usageLimit) {
        return NextResponse.json({ error: 'This coupon has reached its maximum usage limit.' }, { status: 400 });
      }

      if (subtotal < coupon.minOrderValue) {
        return NextResponse.json(
          { error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` },
          { status: 400 }
        );
      }

      let discountAmount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.discountType === 'FIXED') {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(subtotal, Math.round(discountAmount));

      return NextResponse.json({
        valid: true,
        code: coupon.code,
        type: 'COUPON',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        message: `Coupon ${coupon.code} applied! Saved ₹${discountAmount}`,
      });
    }

    // 2. Check Referral Code in Database
    const referral = await db.referral.findUnique({
      where: { referralCode: cleanCode },
    });

    if (referral && referral.status === 'ACTIVE') {
      // Automatic 10% Referral Discount
      const referralDiscountPercent = 10;
      const discountAmount = Math.min(subtotal, Math.round((subtotal * referralDiscountPercent) / 100));

      return NextResponse.json({
        valid: true,
        code: referral.referralCode,
        type: 'REFERRAL',
        discountType: 'PERCENTAGE',
        discountValue: referralDiscountPercent,
        discountAmount,
        referrerName: referral.referrerName,
        message: `Referral code ${referral.referralCode} applied! 10% discount (-₹${discountAmount})`,
      });
    }

    return NextResponse.json({ error: 'Invalid or expired coupon/referral code.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate discount code.' }, { status: 500 });
  }
}

