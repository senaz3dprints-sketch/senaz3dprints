import { google } from 'googleapis';

// Environment variables must stay strictly server-side
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Appends a row to a specific tab in Google Sheets server-side.
 * Never exposes credentials to client bundle.
 */
async function appendToSheet(tabName: string, values: any[]) {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SPREADSHEET_ID) {
    console.log(`[GoogleSheets Sync Fallback] (${tabName}): Credentials unconfigured. Logged data:`, values);
    return false;
  }

  try {
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    console.log(`[GoogleSheets Sync] Successfully recorded row in tab "${tabName}".`);
    return true;
  } catch (error) {
    console.error(`[GoogleSheets Sync Error] Failed to record row in tab "${tabName}":`, error);
    return false;
  }
}

export async function createOrderSheetRecord(order: {
  id: string;
  customerName: string;
  whatsapp: string;
  email?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  discountAmount: number;
  couponCode?: string | null;
  referralCode?: string | null;
  items: string;
  notes?: string | null;
  createdAt: Date;
}) {
  const row = [
    order.id,
    order.createdAt.toISOString(),
    order.customerName,
    order.whatsapp,
    order.email || 'N/A',
    `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`,
    order.items,
    order.totalAmount + order.discountAmount,
    order.discountAmount,
    order.totalAmount,
    order.couponCode || 'None',
    order.referralCode || 'None',
    order.notes || 'None',
    'PENDING',
  ];

  return await appendToSheet('Orders', row);
}

export async function createCustomRequestSheetRecord(request: {
  id: string;
  customerName: string;
  whatsapp: string;
  email?: string | null;
  productType: string;
  materialPreference: string;
  colorPreference: string;
  quantity: number;
  dimensions?: string | null;
  fileUrl?: string | null;
  referenceImageUrl?: string | null;
  additionalNotes?: string | null;
  createdAt: Date;
}) {
  const row = [
    request.id,
    request.createdAt.toISOString(),
    request.customerName,
    request.whatsapp,
    request.email || 'N/A',
    request.productType,
    request.materialPreference,
    request.colorPreference,
    request.quantity,
    request.dimensions || 'N/A',
    request.fileUrl || 'N/A',
    request.referenceImageUrl || 'N/A',
    request.additionalNotes || 'None',
    'PENDING',
  ];

  return await appendToSheet('CustomRequests', row);
}

export async function recordReferralSheetRecord(referral: {
  referralCode: string;
  referrerName: string;
  orderId: string;
  orderValue: number;
  createdAt: Date;
}) {
  const row = [
    referral.referralCode,
    referral.referrerName,
    referral.orderId,
    referral.orderValue,
    referral.createdAt.toISOString(),
    'RECORDED',
  ];

  return await appendToSheet('Referrals', row);
}
