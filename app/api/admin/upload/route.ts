import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/upload';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('file') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
    }

    const result = await saveUploadedFile(image, 'images');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: result.fileUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}
