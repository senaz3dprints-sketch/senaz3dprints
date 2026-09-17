import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createOrderSheetRecord } from '@/lib/google-sheets';
import { generateOrderWhatsAppUrl } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      whatsapp,
      email,
      address,
      city,
      state,
      pincode,
      orderNotes,
      items,
      couponCode,
      referralCode,
    } = body;

    // Server-side validation
    if (!customerName || !whatsapp || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required customer contact or address fields.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 });
    }

    // Recalculate subtotal server-side by looking up real database prices
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} was not found.` },
          { status: 400 }
        );
      }

      const itemPrice = dbProduct.price;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      subtotal += itemPrice * quantity;

      validatedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: itemPrice,
        quantity,
        color: item.color || null,
        size: item.size || null,
        personalizedText: item.personalizedText || null,
      });
    }

    // Validate Coupon Server-Side
    let discountAmount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (
        coupon &&
        coupon.isActive &&
        subtotal >= coupon.minOrderValue &&
        coupon.timesUsed < coupon.usageLimit
      ) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === 'FIXED') {
          discountAmount = coupon.discountValue;
        }
        discountAmount = Math.min(subtotal, discountAmount);
        validCouponCode = coupon.code;

        // Increment coupon timesUsed
        await db.coupon.update({
          where: { id: coupon.id },
          data: { timesUsed: { increment: 1 } },
        });
      }
    }

    // Final total calculation
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Track Referral Code
    let validReferralCode = null;
    if (referralCode) {
      const ref = await db.referral.findUnique({
        where: { referralCode: referralCode.trim().toUpperCase() },
      });
      if (ref) {
        validReferralCode = ref.referralCode;
        await db.referral.update({
          where: { id: ref.id },
          data: {
            totalReferrals: { increment: 1 },
            totalOrderValue: { increment: totalAmount },
          },
        });
      }
    }

    // Generate unique Order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SNZ-${randomSuffix}`;

    // Save order in Database
    const orderRecord = await db.order.create({
      data: {
        id: orderId,
        customerName: customerName.trim(),
        whatsapp: whatsapp.trim(),
        email: email ? email.trim() : null,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        orderNotes: orderNotes ? orderNotes.trim() : null,
        items: JSON.stringify(validatedItems),
        subtotal,
        discountAmount,
        totalAmount,
        couponCode: validCouponCode,
        referralCode: validReferralCode,
        status: 'PENDING',
      },
    });

    // Sync to Google Sheets and trigger email alert
    try {
      await createOrderSheetRecord({
        id: orderRecord.id,
        customerName: orderRecord.customerName,
        whatsapp: orderRecord.whatsapp,
        email: orderRecord.email,
        address: orderRecord.address,
        city: orderRecord.city,
        state: orderRecord.state,
        pincode: orderRecord.pincode,
        totalAmount: orderRecord.totalAmount,
        discountAmount: orderRecord.discountAmount,
        couponCode: orderRecord.couponCode,
        referralCode: orderRecord.referralCode,
        items: JSON.stringify(validatedItems),
        notes: orderRecord.orderNotes,
        createdAt: orderRecord.createdAt,
      });
    } catch (sheetErr) {
      console.error('Google Sheets sync error:', sheetErr);
    }

    // Generate WhatsApp URL
    const whatsappUrl = generateOrderWhatsAppUrl({
      orderId: orderRecord.id,
      customerName: orderRecord.customerName,
      items: validatedItems,
      totalAmount: orderRecord.totalAmount,
      discountAmount: orderRecord.discountAmount,
      address: orderRecord.address,
      city: orderRecord.city,
      pincode: orderRecord.pincode,
    });

    return NextResponse.json({
      success: true,
      orderId: orderRecord.id,
      totalAmount: orderRecord.totalAmount,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to process order. Please try again.' }, { status: 500 });
  }
}
