import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncFeedbackSheetRecord } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const feedbacks = await db.feedback.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // If no feedbacks in db, seed initial default testimonials so the website is not empty
    if (feedbacks.length === 0) {
      const defaults = [
        {
          customerName: 'Arjun K.',
          roleOrCity: 'Product Designer • Bangalore',
          rating: 5,
          comment: 'Uploaded an STL file for a prototype enclosure. The layer smoothness and dimension tolerance were spot on. Quick WhatsApp update too!',
        },
        {
          customerName: 'Priya Sharma',
          roleOrCity: 'Verified Buyer • Mumbai',
          rating: 5,
          comment: 'Ordered personalized name keychains for my team. The dual-color text looks premium and feels super solid in hand. Highly recommended!',
        },
        {
          customerName: 'Vikram R.',
          roleOrCity: 'Tech Enthusiast • Hyderabad',
          rating: 5,
          comment: 'The Low-Poly Dragon statue sits right next to my setup. Crisp geometric edges and fast delivery. SenAZ is my go-to 3D print lab now.',
        },
      ];

      for (const d of defaults) {
        await db.feedback.create({ data: d });
      }

      const initialFeedbacks = await db.feedback.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ feedbacks: initialFeedbacks });
    }

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Failed to fetch feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, roleOrCity, rating, comment } = body;

    if (!customerName?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: 'Please provide your name and feedback comment.' },
        { status: 400 }
      );
    }

    const ratingVal = Math.min(5, Math.max(1, parseInt(rating) || 5));

    const newFeedback = await db.feedback.create({
      data: {
        customerName: customerName.trim(),
        roleOrCity: roleOrCity?.trim() || 'Verified Customer',
        rating: ratingVal,
        comment: comment.trim(),
        isApproved: true,
      },
    });

    // Sync to Google Sheets
    try {
      await syncFeedbackSheetRecord({
        customerName: newFeedback.customerName,
        roleOrCity: newFeedback.roleOrCity,
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        createdAt: newFeedback.createdAt,
      });
    } catch (sheetErr) {
      console.error('Feedback sheet sync error:', sheetErr);
    }

    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
