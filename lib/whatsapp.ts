const DEFAULT_WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '918761053230';

export interface OrderWhatsAppDetails {
  orderId: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    color?: string;
    size?: string;
    personalizedText?: string;
    price: number;
  }>;
  subtotal?: number;
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string | null;
  referralCode?: string | null;
  address: string;
  city: string;
  pincode: string;
}

export function generateOrderWhatsAppUrl(
  order: OrderWhatsAppDetails,
  customNumber?: string
): string {
  const number = customNumber || DEFAULT_WHATSAPP_NUMBER;
  
  let itemDetailsText = '';
  order.items.forEach((item, index) => {
    itemDetailsText += `${index + 1}. *${item.name}*\n`;
    itemDetailsText += `   Qty: ${item.quantity} | Unit Price: ₹${item.price}\n`;
    if (item.color) itemDetailsText += `   Color: ${item.color}\n`;
    if (item.size) itemDetailsText += `   Size: ${item.size}\n`;
    if (item.personalizedText) itemDetailsText += `   Custom Text: "${item.personalizedText}"\n`;
  });

  const subtotal = order.subtotal || (order.totalAmount + (order.discountAmount || 0));
  const discount = order.discountAmount || 0;
  const appliedCode = order.couponCode ? `(Coupon: ${order.couponCode})` : (order.referralCode ? `(Referral: ${order.referralCode})` : '');

  const text = `Hello *SenAZ 3D PRINTS*,

I placed an order on your website and would like to confirm production!

📦 *Order ID:* ${order.orderId}
👤 *Customer:* ${order.customerName}
📍 *Delivery Address:* ${order.address}, ${order.city} - ${order.pincode}

🛒 *Ordered Items:*
${itemDetailsText}
🧾 *BILLING DETAILS:*
• Subtotal: ₹${subtotal}
${discount > 0 ? `• Discount Applied: -₹${discount} ${appliedCode}\n` : ''}• Shipping / Delivery: FREE
💰 *FINAL PAYABLE AMOUNT:* ₹${order.totalAmount}

Please confirm order acceptance and estimated dispatch date. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateProductInquiryUrl(
  productName: string,
  price: number,
  customNumber?: string
): string {
  const number = customNumber || DEFAULT_WHATSAPP_NUMBER;

  const text = `Hello *SenAZ 3D PRINTS*,

I have a question regarding this product:
*${productName}* (Price: ₹${price})

Could you please assist me with customization / delivery timeline details?`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateCustomRequestWhatsAppUrl(
  requestId: string,
  customerName: string,
  productType: string,
  material: string,
  customNumber?: string
): string {
  const number = customNumber || DEFAULT_WHATSAPP_NUMBER;

  const text = `Hello *SenAZ 3D PRINTS*,

I submitted a Custom 3D Printing request!

📋 *Request ID:* ${requestId}
👤 *Name:* ${customerName}
🛠️ *Product Type:* ${productType}
🧪 *Material:* ${material}

I've uploaded my model/reference on your website. Looking forward to your quote!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
