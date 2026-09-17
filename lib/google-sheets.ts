import { google } from 'googleapis';

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

/**
 * Appends a row to Google Sheets server-side.
 * Supports both Google Apps Script Webhook URL (easiest, no cloud console needed)
 * and Google Service Account JWT auth.
 */
async function appendToSheet(tabName: string, values: any[]) {
  // 1. FAST METHOD: Google Apps Script Webhook URL (No service account needed)
  if (GOOGLE_SHEET_WEBHOOK_URL) {
    try {
      const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          tab: tabName,
          row: values,
        }),
      });
      if (res.ok) {
        console.log(`[GoogleSheets Webhook Sync] Successfully synced row to "${tabName}".`);
        return true;
      }
    } catch (err) {
      console.error(`[GoogleSheets Webhook Error] Failed to send data to webhook:`, err);
    }
  }

  // 2. TRADITIONAL METHOD: Google Service Account
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SPREADSHEET_ID) {
    console.log(`[GoogleSheets Sync Fallback] (${tabName}): Credentials unconfigured. Data logged safely in DB:`, values);
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
  // Format items nicely for the sheet
  let itemsSummary = order.items;
  try {
    const parsedItems = JSON.parse(order.items);
    if (Array.isArray(parsedItems)) {
      itemsSummary = parsedItems
        .map((it: any) => {
          let desc = `${it.quantity}x ${it.name}`;
          const details: string[] = [];
          if (it.color) details.push(`Color: ${it.color}`);
          if (it.size) details.push(`Size: ${it.size}`);
          if (it.personalizedText) details.push(`Text: "${it.personalizedText}"`);
          if (details.length > 0) desc += ` (${details.join(', ')})`;
          return desc;
        })
        .join(' | ');
    }
  } catch (e) {}

  // Format date in IST
  const istDate = new Date(order.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const row = [
    order.id,                                                            // 1. Order ID
    istDate,                                                             // 2. Date & Time
    order.customerName,                                                  // 3. Customer Name
    order.whatsapp,                                                      // 4. WhatsApp Number
    order.email || 'N/A',                                                // 5. Email Address
    `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, // 6. Full Address
    itemsSummary,                                                        // 7. Ordered Items & Quantities
    order.totalAmount + order.discountAmount,                            // 8. Subtotal (₹)
    order.discountAmount,                                                // 9. Discount (₹)
    order.totalAmount,                                                   // 10. Final Total (₹)
    order.couponCode || 'None',                                          // 11. Coupon Code
    order.referralCode || 'None',                                        // 12. Referral Code
    order.notes || 'None',                                               // 13. Customer Notes
    'PENDING',                                                           // 14. Status
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
  const istDate = new Date(request.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const row = [
    request.id,                          // 1. Request ID
    istDate,                             // 2. Date & Time
    request.customerName,                // 3. Customer Name
    request.whatsapp,                    // 4. WhatsApp Number
    request.email || 'N/A',              // 5. Email Address
    request.productType,                 // 6. Product Type
    request.materialPreference,          // 7. Material
    request.colorPreference,             // 8. Color
    request.quantity,                    // 9. Quantity
    request.dimensions || 'N/A',         // 10. Dimensions
    request.fileUrl || 'N/A',            // 11. STL File Link
    request.referenceImageUrl || 'N/A',  // 12. Reference Image Link
    request.additionalNotes || 'None',   // 13. Additional Notes
    'PENDING',                           // 14. Status
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
  const istDate = new Date(referral.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const row = [
    referral.referralCode,  // Referral Code
    referral.referrerName,  // Referrer Name
    referral.orderId,       // Order ID
    referral.orderValue,    // Order Value (₹)
    istDate,                // Date & Time
    'RECORDED',             // Status
  ];

  return await appendToSheet('Referrals', row);
}

