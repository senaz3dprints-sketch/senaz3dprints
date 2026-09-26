import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { saveUploadedFile } from '@/lib/upload';
import { createCustomRequestSheetRecord } from '@/lib/google-sheets';
import { generateCustomRequestWhatsAppUrl } from '@/lib/whatsapp';
import { sendAdminNewCustomRequestEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const customerName = formData.get('customerName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const email = formData.get('email') as string;
    const productType = formData.get('productType') as string;
    const materialPreference = (formData.get('materialPreference') as string) || 'PLA+';
    const colorPreference = (formData.get('colorPreference') as string) || 'White';
    const quantityStr = formData.get('quantity') as string;
    const dimensions = formData.get('dimensions') as string;
    const additionalNotes = formData.get('additionalNotes') as string;

    const file3d = formData.get('file3d') as File | null;
    const file3dLink = (formData.get('file3dLink') as string)?.trim();
    const referenceImage = formData.get('referenceImage') as File | null;

    if (!customerName || !whatsapp || !productType) {
      return NextResponse.json(
        { error: 'Please provide customer name, WhatsApp number, and product type.' },
        { status: 400 }
      );
    }

    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let referenceImageUrl: string | undefined = undefined;

    // Process 3D file upload if provided
    if (file3d && file3d.size > 0) {
      const uploadRes = await saveUploadedFile(file3d, '3d-models');
      if (!uploadRes.success) {
        return NextResponse.json({ error: uploadRes.error }, { status: 400 });
      }
      fileUrl = uploadRes.fileUrl;
      fileName = uploadRes.fileName;
    } else if (file3dLink) {
      fileUrl = file3dLink;
      fileName = 'Cloud 3D Model Link';
    }

    // Process reference image if provided
    if (referenceImage && referenceImage.size > 0) {
      const imgUploadRes = await saveUploadedFile(referenceImage, 'images');
      if (!imgUploadRes.success) {
        return NextResponse.json({ error: imgUploadRes.error }, { status: 400 });
      }
      referenceImageUrl = imgUploadRes.fileUrl;
    }

    const quantity = Math.max(1, parseInt(quantityStr) || 1);

    // Generate Request ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `SNZ-REQ-${randomSuffix}`;

    // Create DB entry
    const requestRecord = await db.customRequest.create({
      data: {
        id: requestId,
        customerName: customerName.trim(),
        whatsapp: whatsapp.trim(),
        email: email ? email.trim() : null,
        fileUrl,
        fileName,
        referenceImageUrl,
        productType: productType.trim(),
        materialPreference,
        colorPreference,
        quantity,
        dimensions: dimensions ? dimensions.trim() : null,
        additionalNotes: additionalNotes ? additionalNotes.trim() : null,
        status: 'PENDING',
      },
    });

    // Google Sheets Sync
    try {
      await createCustomRequestSheetRecord({
        id: requestRecord.id,
        customerName: requestRecord.customerName,
        whatsapp: requestRecord.whatsapp,
        email: requestRecord.email,
        productType: requestRecord.productType,
        materialPreference: requestRecord.materialPreference,
        colorPreference: requestRecord.colorPreference,
        quantity: requestRecord.quantity,
        dimensions: requestRecord.dimensions,
        fileUrl: requestRecord.fileUrl,
        referenceImageUrl: requestRecord.referenceImageUrl,
        additionalNotes: requestRecord.additionalNotes,
        createdAt: requestRecord.createdAt,
      });
    } catch (sheetErr) {
      console.error('Custom request Google Sheets sync error:', sheetErr);
    }

    // Direct Email Alert to Admin
    try {
      await sendAdminNewCustomRequestEmail({
        id: requestRecord.id,
        customerName: requestRecord.customerName,
        whatsapp: requestRecord.whatsapp,
        email: requestRecord.email,
        productType: requestRecord.productType,
        materialPreference: requestRecord.materialPreference,
        colorPreference: requestRecord.colorPreference,
        quantity: requestRecord.quantity,
        dimensions: requestRecord.dimensions,
        fileUrl: requestRecord.fileUrl,
        fileName: requestRecord.fileName,
        referenceImageUrl: requestRecord.referenceImageUrl,
        additionalNotes: requestRecord.additionalNotes,
      });
    } catch (emailErr) {
      console.error('Admin email dispatch error:', emailErr);
    }

    // WhatsApp Redirect URL
    const whatsappUrl = generateCustomRequestWhatsAppUrl(
      requestRecord.id,
      requestRecord.customerName,
      requestRecord.productType,
      requestRecord.materialPreference
    );

    return NextResponse.json({
      success: true,
      requestId: requestRecord.id,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Custom request error:', error);
    return NextResponse.json(
      { error: 'Failed to process custom 3D printing request.' },
      { status: 500 }
    );
  }
}
