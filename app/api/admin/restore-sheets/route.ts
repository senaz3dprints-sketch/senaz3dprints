import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { restoreFromSheetUrl } from '@/scripts/restore-from-sheets';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { sheetUrlOrId } = await req.json();
    if (!sheetUrlOrId) {
      return NextResponse.json({ error: 'Please provide a Google Sheet URL or Spreadsheet ID.' }, { status: 400 });
    }

    await restoreFromSheetUrl(sheetUrlOrId);

    return NextResponse.json({ success: true, message: 'Google Sheets data restored successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to restore data.' }, { status: 500 });
  }
}
