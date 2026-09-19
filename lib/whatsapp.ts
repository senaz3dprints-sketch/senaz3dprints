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
  shippingFee?: number;
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
    itemDetailsText += `   Qty: ${item.quantity} | Unit Price: Rs. ${item.price}\n`;
    if (item.color) itemDetailsText += `   Color: ${item.color}\n`;
    if (item.size) itemDetailsText += `   Size: ${item.size}\n`;
    if (item.personalizedText) itemDetailsText += `   Custom Text: "${item.personalizedText}"\n`;
  });

  const subtotal = order.subtotal || (order.totalAmount + (order.discountAmount || 0));
  const discount = order.discountAmount || 0;
  const appliedCode = order.couponCode ? `(Coupon: ${order.couponCode})` : (order.referralCode ? `(Referral: ${order.referralCode})` : '');
  const shippingText = typeof order.shippingFee === 'number' && order.shippingFee > 0 ? `Rs. ${order.shippingFee}` : 'FREE';

  const text = `Hello *SenAZ 3D PRINTS*,

I placed an order on your website and would like to confirm production!

*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Delivery Address:* ${order.address}, ${order.city} - ${order.pincode}

*Ordered Items:*
${itemDetailsText}
*BILLING DETAILS:*
- Subtotal: Rs. ${subtotal}
${discount > 0 ? `- Discount Applied: -Rs. ${discount} ${appliedCode}\n` : ''}- Shipping / Delivery: ${shippingText}
*FINAL PAYABLE AMOUNT:* Rs. ${order.totalAmount}

Please confirm order acceptance and estimated dispatch date. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateProductInquiryUrl(
  productName: string,
  price: number,
  options?: {
    personalizedText?: string;
    color?: string;
    size?: string;
    quantity?: number;
    customNumber?: string;
  }
): string {
  const number = options?.customNumber || DEFAULT_WHATSAPP_NUMBER;
  const qty = options?.quantity || 1;
  const total = price * qty;

  let text = `Hello *SenAZ 3D PRINTS*,

I would like to order / inquire about:
*${productName}*
• Quantity: ${qty} | Price: Rs. ${price} (Total: Rs. ${total})\n`;

  if (options?.color) text += `• Selected Color: ${options.color}\n`;
  if (options?.size) text += `• Selected Size: ${options.size}\n`;
  if (options?.personalizedText) text += `• Custom Text / Personalisation: "${options.personalizedText}"\n`;

  text += `\nPlease confirm production scheduling and delivery timeline. Thank you!`;

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

*Request ID:* ${requestId}
*Name:* ${customerName}
*Product Type:* ${productType}
*Material:* ${material}

I have uploaded my model/reference on your website. Looking forward to your quote!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateAdminToCustomerConfirmationWhatsAppUrl(order: {
  customerPhone: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  status: string;
}): string {
  const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
  const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  let statusDetails = '';
  switch (order.status) {
    case 'CONFIRMED':
      statusDetails = 'Your order has been CONFIRMED by our team and is scheduled for 3D printing!';
      break;
    case 'PROCESSING':
      statusDetails = 'Your order is currently IN PRODUCTION (3D Printing & Quality Finishing) in our lab.';
      break;
    case 'SHIPPED':
      statusDetails = 'Great news! Your order has been DISPATCHED / SHIPPED and is on its way to your delivery address.';
      break;
    case 'DELIVERED':
      statusDetails = 'Your order has been DELIVERED successfully! We hope you love your custom 3D prints.';
      break;
    case 'CANCELLED':
      statusDetails = 'Your order has been marked as CANCELLED. Please contact us if you have any questions.';
      break;
    default:
      statusDetails = `Your order status is now: *${order.status}*.`;
  }

  const text = `Hello *${order.customerName}*,

Order Update from *SenAZ 3D PRINTS*:

*Order ID:* ${order.orderId}
*Current Status:* ${order.status}
*Total Amount:* Rs. ${order.totalAmount}

${statusDetails}

For live photos or questions, reply to this message directly.

Best regards,
*SenAZ 3D PRINTS*
https://senaz3dprints.in`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}



