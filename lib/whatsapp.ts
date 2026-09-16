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
  totalAmount: number;
  discountAmount?: number;
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
    itemDetailsText += `   Qty: ${item.quantity} | Price: ₹${item.price}\n`;
    if (item.color) itemDetailsText += `   Color: ${item.color}\n`;
    if (item.size) itemDetailsText += `   Size: ${item.size}\n`;
    if (item.personalizedText) itemDetailsText += `   Personalised Text: "${item.personalizedText}"\n`;
  });

  const text = `Hello *SenAZ 3D PRINTS*,

I would like to confirm my order!

📦 *Order ID:* ${order.orderId}
👤 *Name:* ${order.customerName}
📍 *Address:* ${order.address}, ${order.city} - ${order.pincode}

🛒 *Items:*
${itemDetailsText}
💰 *Total Amount:* ₹${order.totalAmount}${order.discountAmount ? ` (Saved ₹${order.discountAmount})` : ''}

Please confirm availability and dispatch date. Thank you!`;

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
