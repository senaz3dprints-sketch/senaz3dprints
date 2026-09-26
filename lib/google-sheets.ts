import { google } from 'googleapis';

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

/**
 * Appends a row to Google Sheets server-side.
 * Supports both Google Apps Script Webhook URL (easiest, zero-auth needed)
 * and Google Service Account JWT auth.
 */
async function appendToSheet(tabName: string, values: any[]) {
  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbzp2hoe4tcNwvk75WrHzWL6euz8_xLOhVDlbtwv6jFtaB5tpxHLr6b21F-6HloUTL3uEA/exec';

  // 1. FAST METHOD: Google Apps Script Webhook URL
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
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
      } else {
        console.error(`[GoogleSheets Webhook HTTP Error] Status ${res.status}:`, await res.text());
      }
    } catch (err) {
      console.error(`[GoogleSheets Webhook Error] Failed to send data to webhook:`, err);
    }
  }

  // 2. TRADITIONAL METHOD: Google Service Account
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    console.log(`[GoogleSheets Sync Fallback] (${tabName}): Data recorded safely in database.`);
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
  subtotal?: number;
  shippingFee?: number;
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

  const subtotalValue = typeof order.subtotal === 'number'
    ? order.subtotal
    : (order.totalAmount + order.discountAmount - (order.shippingFee || 0));

  const row = [
    order.id,                                                            // 1. Order ID
    istDate,                                                             // 2. Date & Time
    order.customerName,                                                  // 3. Customer Name
    order.whatsapp,                                                      // 4. WhatsApp Number
    order.email || 'N/A',                                                // 5. Email Address
    `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, // 6. Full Address
    itemsSummary,                                                        // 7. Ordered Items & Quantities
    subtotalValue,                                                       // 8. Subtotal (₹)
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senaz3dprints.in';
  const fileLink = request.fileUrl
    ? (request.fileUrl.startsWith('data:')
        ? `${siteUrl}/api/custom-request/download?id=${request.id}&type=file`
        : (request.fileUrl.startsWith('http') ? request.fileUrl : `${siteUrl}${request.fileUrl}`))
    : 'N/A';

  const imageLink = request.referenceImageUrl
    ? (request.referenceImageUrl.startsWith('data:')
        ? `${siteUrl}/api/custom-request/download?id=${request.id}&type=image`
        : (request.referenceImageUrl.startsWith('http') ? request.referenceImageUrl : `${siteUrl}${request.referenceImageUrl}`))
    : 'N/A';

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
    fileLink,                            // 11. STL File Link (Clean Download URL)
    imageLink,                           // 12. Reference Image Link (Clean Download URL)
    request.additionalNotes || 'None',   // 13. Additional Notes
    'PENDING',                           // 14. Status
  ];

  return await appendToSheet('CustomRequests', row);
}

export async function syncReferralPartnerSheetRecord(referral: {
  referralCode: string;
  referrerName: string;
  referrerContact?: string | null;
  status: string;
  createdAt: Date;
}) {
  const istDate = new Date(referral.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const row = [
    referral.referralCode,             // 1. Referral Code
    referral.referrerName,             // 2. Referrer Name
    referral.referrerContact || 'N/A', // 3. Contact
    0,                                 // 4. Total Orders
    0,                                 // 5. Total Sales (₹)
    referral.status,                   // 6. Status
    istDate,                           // 7. Created Date
  ];

  return await appendToSheet('Referrals', row);
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

export async function syncProductSheetRecord(product: {
  name: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  material?: string | null;
  stockQuantity?: number;
  personalizationEnabled?: boolean;
  tags?: string[];
}) {
  const row = [
    product.name,                                     // 1. Name
    product.categoryName || 'General',                // 2. Category
    product.price,                                    // 3. Price (₹)
    product.compareAtPrice || '',                     // 4. Compare At Price (₹)
    product.shortDescription || '',                   // 5. Short Description
    product.fullDescription || '',                    // 6. Full Description
    (product.images || []).join(', '),                // 7. Image URLs
    (product.colors || []).join(', '),                // 8. Colors
    (product.sizes || []).join(', '),                 // 9. Sizes
    product.material || 'PLA+',                       // 10. Material
    product.stockQuantity ?? 20,                      // 11. Stock Quantity
    product.personalizationEnabled ? 'TRUE' : 'FALSE',// 12. Personalization
    (product.tags || []).join(', '),                  // 13. Tags
  ];

  return await appendToSheet('Products', row);
}

export async function syncReceiptSheetRecord(receipt: {
  receiptNumber: string;
  docType: string;
  customerName: string;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  items: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: string;
  paymentMode: string;
  customerNotes?: string | null;
  issueDate: string;
}) {
  let itemsSummary = receipt.items;
  try {
    const parsed = typeof receipt.items === 'string' ? JSON.parse(receipt.items) : receipt.items;
    if (Array.isArray(parsed)) {
      itemsSummary = parsed.map((it: any) => `${it.quantity}x ${it.name} (₹${it.total})`).join(' | ');
    }
  } catch (e) {}

  const fullAddr = [receipt.address, receipt.city, receipt.state, receipt.pincode].filter(Boolean).join(', ');

  const row = [
    receipt.receiptNumber,                   // 1. Receipt Ref No
    receipt.issueDate,                       // 2. Date
    receipt.docType,                         // 3. Document Type
    receipt.customerName,                    // 4. Customer Name
    receipt.whatsapp || 'N/A',               // 5. WhatsApp
    fullAddr || 'N/A',                       // 6. Full Address
    itemsSummary,                            // 7. Items Summary
    receipt.subtotal,                        // 8. Subtotal (₹)
    receipt.discountAmount,                  // 9. Discount (₹)
    receipt.shippingFee,                     // 10. Shipping (₹)
    receipt.grandTotal,                      // 11. Grand Total (₹)
    receipt.advancePaid,                     // 12. Advance Paid (₹)
    receipt.balanceDue,                      // 13. Balance Due (₹)
    receipt.paymentStatus,                   // 14. Payment Status
    receipt.paymentMode,                     // 15. Payment Mode
    receipt.customerNotes || 'None',         // 16. Notes
  ];

  return await appendToSheet('Receipts', row);
}

/**
 * Updates status of a custom 3D printing request in Google Sheets (CustomRequests tab)
 */
export async function updateCustomRequestStatusSheetRecord(
  requestId: string,
  newStatus: string,
  details?: {
    customerName?: string;
    customerEmail?: string | null;
    whatsapp?: string;
    productType?: string;
  }
) {
  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbzp2hoe4tcNwvk75WrHzWL6euz8_xLOhVDlbtwv6jFtaB5tpxHLr6b21F-6HloUTL3uEA/exec';

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          action: 'updateCustomRequestStatus',
          tab: 'CustomRequests',
          requestId,
          status: newStatus,
          customerName: details?.customerName,
          customerEmail: details?.customerEmail,
          whatsapp: details?.whatsapp,
          productType: details?.productType,
        }),
      });
      if (res.ok) {
        console.log(`[GoogleSheets Sync] Updated custom request ${requestId} status to "${newStatus}".`);
        return true;
      }
    } catch (err) {
      console.error(`[GoogleSheets Sync Error] Failed to update custom request status:`, err);
    }
  }

  return false;
}


/**
 * Updates order status in Google Sheets (Column 14 / N) by matching Order ID (Column 1 / A)
 * and triggers customer email notifications on status change (e.g. CONFIRMED).
 */
export async function updateOrderStatusSheetRecord(
  orderId: string,
  newStatus: string,
  orderDetails?: {
    customerName?: string;
    customerEmail?: string | null;
    totalAmount?: number;
    subtotal?: number;
    discountAmount?: number;
    items?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }
) {
  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbzp2hoe4tcNwvk75WrHzWL6euz8_xLOhVDlbtwv6jFtaB5tpxHLr6b21F-6HloUTL3uEA/exec';

  let itemsSummary = '';
  if (orderDetails?.items) {
    try {
      const parsedItems = JSON.parse(orderDetails.items);
      if (Array.isArray(parsedItems)) {
        itemsSummary = parsedItems
          .map((it: any) => `${it.quantity}x ${it.name}` + (it.personalizedText ? ` ("${it.personalizedText}")` : ''))
          .join(', ');
      }
    } catch (e) {
      itemsSummary = orderDetails.items;
    }
  }

  // 1. Google Apps Script Webhook
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          action: 'updateStatus',
          tab: 'Orders',
          orderId,
          status: newStatus,
          customerName: orderDetails?.customerName,
          customerEmail: orderDetails?.customerEmail,
          totalAmount: orderDetails?.totalAmount,
          items: itemsSummary,
          address: orderDetails?.address ? `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}` : undefined,
        }),
      });
      if (res.ok) {
        console.log(`[GoogleSheets Sync] Updated order ${orderId} status to "${newStatus}".`);
        return true;
      }
    } catch (err) {
      console.error(`[GoogleSheets Sync Error] Failed to update status in webhook:`, err);
    }
  }

  // 2. Google Service Account Fallback
  if (SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY && SPREADSHEET_ID) {
    try {
      const auth = new google.auth.JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });
      const getRows = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Orders!A:N',
      });
      const rows = getRows.data.values || [];
      const rowIndex = rows.findIndex((r) => r[0] === orderId);
      if (rowIndex !== -1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Orders!N${rowIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[newStatus]],
          },
        });
        return true;
      }
    } catch (error) {
      console.error('[GoogleSheets JWT Status Update Error]', error);
    }
  }

  return false;
}

export async function syncFeedbackSheetRecord(feedback: {
  customerName: string;
  roleOrCity?: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
}) {
  const istDate = new Date(feedback.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const row = [
    feedback.customerName,
    feedback.roleOrCity || 'Verified Buyer',
    `${feedback.rating} Stars`,
    feedback.comment,
    istDate,
  ];

  return await appendToSheet('Feedbacks', row);
}

