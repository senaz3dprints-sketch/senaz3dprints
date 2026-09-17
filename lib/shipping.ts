import { db } from './db';

export interface ShippingSettings {
  flatRate: number;              // e.g., 50 (or 0 for free)
  freeShippingThreshold: number; // e.g., 499 (0 means no free threshold)
  shippingNote: string;          // e.g., "Standard delivery in 3-5 business days"
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  flatRate: 0,
  freeShippingThreshold: 0,
  shippingNote: 'Standard delivery in 3-5 business days across India',
};

export async function getShippingSettings(): Promise<ShippingSettings> {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: 'shipping' },
    });
    if (record && record.content) {
      const parsed = JSON.parse(record.content);
      return {
        flatRate: typeof parsed.flatRate === 'number' ? Math.max(0, parsed.flatRate) : 0,
        freeShippingThreshold: typeof parsed.freeShippingThreshold === 'number' ? Math.max(0, parsed.freeShippingThreshold) : 0,
        shippingNote: parsed.shippingNote || DEFAULT_SHIPPING_SETTINGS.shippingNote,
      };
    }
  } catch (e) {
    console.error('Failed to fetch shipping settings from DB:', e);
  }
  return DEFAULT_SHIPPING_SETTINGS;
}

export function calculateShippingFee(subtotal: number, settings: ShippingSettings): number {
  if (!settings || settings.flatRate <= 0) {
    return 0;
  }
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
    return 0;
  }
  return settings.flatRate;
}
