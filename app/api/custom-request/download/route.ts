import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName || '').toLowerCase();
  switch (ext) {
    case '.stl':
      return 'model/stl';
    case '.3mf':
      return 'model/3mf';
    case '.obj':
      return 'model/obj';
    case '.step':
    case '.stp':
      return 'application/step';
    case '.gcode':
      return 'text/x-gcode';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'file'; // 'file' | 'image'

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required.' }, { status: 400 });
    }

    const customReq = await db.customRequest.findUnique({
      where: { id },
    });

    if (!customReq) {
      return NextResponse.json({ error: 'Custom request not found.' }, { status: 404 });
    }

    const targetUrl = type === 'image' ? customReq.referenceImageUrl : customReq.fileUrl;
    const defaultFileName = type === 'image' ? `reference_${id}.jpg` : (customReq.fileName || `model_${id}.stl`);

    if (!targetUrl) {
      return NextResponse.json({ error: 'No file attached to this request.' }, { status: 404 });
    }

    // 1. If stored as Base64 Data URL
    if (targetUrl.startsWith('data:')) {
      const parts = targetUrl.split(',');
      if (parts.length < 2) {
        return NextResponse.json({ error: 'Invalid file data format.' }, { status: 400 });
      }

      const mimeMatch = parts[0].match(/:(.*?);/);
      const declaredMime = mimeMatch ? mimeMatch[1] : '';
      const actualMime = declaredMime && declaredMime !== 'application/octet-stream'
        ? declaredMime
        : getMimeType(defaultFileName);

      const buffer = Buffer.from(parts[1], 'base64');
      const sanitizedName = encodeURIComponent(defaultFileName).replace(/['()]/g, escape);

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': actualMime,
          'Content-Disposition': `attachment; filename="${defaultFileName}"; filename*=UTF-8''${sanitizedName}`,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    // 2. If stored as local static path (e.g. /uploads/3d-models/...)
    if (targetUrl.startsWith('/uploads/')) {
      const localFilePath = path.join(process.cwd(), 'public', targetUrl.replace(/^\//, ''));
      if (fs.existsSync(localFilePath)) {
        const buffer = fs.readFileSync(localFilePath);
        const actualMime = getMimeType(defaultFileName);
        const sanitizedName = encodeURIComponent(defaultFileName).replace(/['()]/g, escape);

        return new Response(buffer, {
          status: 200,
          headers: {
            'Content-Type': actualMime,
            'Content-Disposition': `attachment; filename="${defaultFileName}"; filename*=UTF-8''${sanitizedName}`,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'private, max-age=3600',
          },
        });
      }
    }

    // 3. If stored as external HTTP(S) URL
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      return NextResponse.redirect(targetUrl);
    }

    return NextResponse.json({ error: 'File resource could not be located.' }, { status: 404 });
  } catch (err: any) {
    console.error('Custom request file download error:', err);
    return NextResponse.json(
      { error: 'Failed to download file.' },
      { status: 500 }
    );
  }
}
