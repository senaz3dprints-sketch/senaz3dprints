import { db } from './db';
import {
  ShippingZone,
  ShippingSettings,
  DEFAULT_SHIPPING_ZONES,
  DEFAULT_SHIPPING_SETTINGS,
  findZoneForState,
  calculateShippingFee,
  ALL_INDIAN_STATES,
} from './shipping-utils';

export * from './shipping-utils';

export async function getShippingSettings(): Promise<ShippingSettings> {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: 'shipping' },
    });
    if (record && record.content) {
      const parsed = JSON.parse(record.content);
      return {
        defaultRate:
          typeof parsed.defaultRate === 'number'
            ? Math.max(0, parsed.defaultRate)
            : typeof parsed.flatRate === 'number'
            ? parsed.flatRate
            : DEFAULT_SHIPPING_SETTINGS.defaultRate,
        freeShippingThreshold:
          typeof parsed.freeShippingThreshold === 'number'
            ? Math.max(0, parsed.freeShippingThreshold)
            : DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
        shippingNote: parsed.shippingNote || DEFAULT_SHIPPING_SETTINGS.shippingNote,
        calculationMode: parsed.calculationMode || DEFAULT_SHIPPING_SETTINGS.calculationMode,
        zones: Array.isArray(parsed.zones) && parsed.zones.length > 0 ? parsed.zones : DEFAULT_SHIPPING_ZONES,
      };
    }
  } catch (e) {
    console.error('Failed to fetch shipping settings from DB:', e);
  }
  return DEFAULT_SHIPPING_SETTINGS;
}
