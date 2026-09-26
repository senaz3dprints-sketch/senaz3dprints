import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER || 'senaz3dprints@gmail.com';

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendAdminNewCustomRequestEmail(request: {
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
  fileName?: string | null;
  referenceImageUrl?: string | null;
  additionalNotes?: string | null;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[Email Notice] SMTP credentials not set. Set SMTP_USER and SMTP_PASS (or GMAIL_USER and GMAIL_APP_PASSWORD) in .env to receive direct email alerts.');
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senaz3dprints.in';
  const downloadUrl = request.fileUrl
    ? `${siteUrl}/api/custom-request/download?id=${request.id}&type=file`
    : null;
  const imageUrl = request.referenceImageUrl
    ? `${siteUrl}/api/custom-request/download?id=${request.id}&type=image`
    : null;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px; margin: auto;">
      <div style="border-bottom: 2px solid #00e5ff; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #00e5ff; margin: 0;">🚀 New Custom 3D Printing Request</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Request ID: <strong>${request.id}</strong></p>
      </div>

      <div style="background: #121826; padding: 18px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h3 style="color: #fff; margin-top: 0; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 8px;">Customer Information</h3>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Name:</strong> ${request.customerName}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>WhatsApp:</strong> <a href="https://wa.me/${request.whatsapp}" style="color: #10b981; text-decoration: none;">+${request.whatsapp}</a></p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Email:</strong> ${request.email || 'N/A'}</p>
      </div>

      <div style="background: #121826; padding: 18px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h3 style="color: #fff; margin-top: 0; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 8px;">Project Specifications</h3>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Product Type:</strong> ${request.productType}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Material:</strong> ${request.materialPreference}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Color:</strong> ${request.colorPreference}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Quantity:</strong> ${request.quantity}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Dimensions:</strong> ${request.dimensions || 'N/A'}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Notes:</strong> ${request.additionalNotes || 'None'}</p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        ${downloadUrl ? `<a href="${downloadUrl}" style="display: inline-block; background: #00e5ff; color: #0b0f19; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 6px;">📥 Download 3D Model (${request.fileName || 'STL'})</a>` : ''}
        ${imageUrl ? `<a href="${imageUrl}" style="display: inline-block; background: #38bdf8; color: #0b0f19; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 6px;">🖼️ View Reference Image</a>` : ''}
        <a href="${siteUrl}/admin/custom-requests" style="display: inline-block; background: #1e293b; color: #fff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 6px;">Open Admin Dashboard</a>
      </div>
    </div>
  `;

  try {
    const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || ADMIN_EMAIL;
    await transporter.sendMail({
      from: `"SenAZ 3D PRINTS" <${senderUser}>`,
      to: ADMIN_EMAIL,
      subject: `🚨 New Custom 3D Request: ${request.id} - ${request.customerName}`,
      html,
    });
    console.log(`[Email Alert] Admin email sent for custom request ${request.id}`);
    return true;
  } catch (err) {
    console.error(`[Email Alert Error] Failed to send admin email for request ${request.id}:`, err);
    return false;
  }
}

export async function sendAdminNewOrderEmail(order: {
  id: string;
  customerName: string;
  whatsapp: string;
  email?: string | null;
  totalAmount: number;
  items: any[];
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[Email Notice] SMTP credentials not configured.');
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senaz3dprints.in';

  const itemsHtml = order.items.map((it) => `
    <li style="margin-bottom: 6px; font-size: 13px;">
      <strong>${it.quantity}x ${it.name}</strong> - ₹${it.price} each
      ${it.color ? `<br><span style="color: #94a3b8; font-size: 11px;">Color: ${it.color}</span>` : ''}
      ${it.size ? `<br><span style="color: #94a3b8; font-size: 11px;">Size: ${it.size}</span>` : ''}
      ${it.personalizedText ? `<br><span style="color: #00e5ff; font-size: 11px;">Inscribed: "${it.personalizedText}"</span>` : ''}
    </li>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px; margin: auto;">
      <div style="border-bottom: 2px solid #00e5ff; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #00e5ff; margin: 0;">📦 New Store Order Placed!</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Order ID: <strong>${order.id}</strong> | Total: <strong>₹${order.totalAmount}</strong></p>
      </div>

      <div style="background: #121826; padding: 18px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h3 style="color: #fff; margin-top: 0; font-size: 15px;">Customer & Delivery</h3>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0;"><strong>WhatsApp:</strong> <a href="https://wa.me/${order.whatsapp}" style="color: #10b981;">+${order.whatsapp}</a></p>
        <p style="margin: 4px 0;"><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
      </div>

      <div style="background: #121826; padding: 18px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h3 style="color: #fff; margin-top: 0; font-size: 15px;">Ordered Items</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${itemsHtml}
        </ul>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${siteUrl}/admin/orders" style="display: inline-block; background: #00e5ff; color: #0b0f19; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View in Admin Portal</a>
      </div>
    </div>
  `;

  try {
    const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || ADMIN_EMAIL;
    await transporter.sendMail({
      from: `"SenAZ 3D PRINTS" <${senderUser}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 New Order: ${order.id} - ₹${order.totalAmount} (${order.customerName})`,
      html,
    });
    console.log(`[Email Alert] Admin email sent for order ${order.id}`);
    return true;
  } catch (err) {
    console.error(`[Email Alert Error] Failed to send admin email for order ${order.id}:`, err);
    return false;
  }
}
