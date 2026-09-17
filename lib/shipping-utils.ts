export interface ShippingZone {
  id: string;
  name: string;
  states: string[];
  rate: number;
}

export interface ShippingSettings {
  defaultRate: number;              // default e.g. 60
  freeShippingThreshold: number;    // e.g. 499 (0 means disabled)
  shippingNote: string;             // e.g. "Standard delivery in 3-5 business days across India"
  calculationMode: 'MAX_OF_ZONE_AND_PRODUCTS' | 'ZONE_PLUS_PRODUCT_SURCHARGES' | 'ZONE_BASE';
  zones: ShippingZone[];
}

export const ALL_INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const DEFAULT_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'local_northeast',
    name: 'Assam & North East (Local Zone)',
    states: [
      'Assam',
      'Meghalaya',
      'Tripura',
      'Manipur',
      'Mizoram',
      'Nagaland',
      'Arunachal Pradesh',
      'Sikkim'
    ],
    rate: 40,
  },
  {
    id: 'metro_cities',
    name: 'Metro Hubs (Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai)',
    states: [
      'Delhi',
      'Maharashtra',
      'Karnataka',
      'Telangana',
      'West Bengal',
      'Tamil Nadu'
    ],
    rate: 60,
  },
  {
    id: 'rest_of_india',
    name: 'Rest of India',
    states: [
      'Uttar Pradesh',
      'Bihar',
      'Rajasthan',
      'Madhya Pradesh',
      'Gujarat',
      'Punjab',
      'Haryana',
      'Odisha',
      'Kerala',
      'Andhra Pradesh',
      'Jharkhand',
      'Chhattisgarh',
      'Uttarakhand',
      'Himachal Pradesh',
      'Goa',
      'Jammu and Kashmir',
      'Ladakh',
      'Chandigarh',
      'Puducherry'
    ],
    rate: 75,
  }
];

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  defaultRate: 60,
  freeShippingThreshold: 0,
  shippingNote: 'Standard delivery in 3-5 business days across India',
  calculationMode: 'MAX_OF_ZONE_AND_PRODUCTS',
  zones: DEFAULT_SHIPPING_ZONES,
};

export function findZoneForState(stateName?: string | null, zones: ShippingZone[] = DEFAULT_SHIPPING_ZONES): ShippingZone | null {
  if (!stateName || !stateName.trim() || !Array.isArray(zones)) return null;
  const clean = stateName.trim().toLowerCase();

  for (const zone of zones) {
    if (!Array.isArray(zone.states)) continue;
    for (const st of zone.states) {
      const lower = st.trim().toLowerCase();
      if (clean === lower || clean.includes(lower) || lower.includes(clean)) {
        return zone;
      }
    }
  }
  return null;
}

export function calculateShippingFee(
  subtotal: number,
  settings: ShippingSettings = DEFAULT_SHIPPING_SETTINGS,
  options?: {
    state?: string | null;
    items?: Array<{ shippingFee?: number | null; quantity?: number }>;
  }
): number {
  if (!settings) return 0;

  // 1. Check Free Shipping Threshold
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
    return 0;
  }

  // 2. Determine Zone Base Rate from Customer State
  const matchedZone = findZoneForState(options?.state, settings.zones);
  const baseZoneRate = matchedZone ? matchedZone.rate : (typeof settings.defaultRate === 'number' ? settings.defaultRate : 0);

  // 3. Determine Individual Product Shipping Overrides / Surcharges
  const items = options?.items || [];
  const productFees = items.map((it) => (typeof it.shippingFee === 'number' && it.shippingFee > 0 ? it.shippingFee : 0));
  const maxProductFee = productFees.length > 0 ? Math.max(0, ...productFees) : 0;

  if (settings.calculationMode === 'ZONE_BASE') {
    return baseZoneRate;
  }

  if (settings.calculationMode === 'ZONE_PLUS_PRODUCT_SURCHARGES') {
    const totalSurcharges = items.reduce((sum, it) => sum + (Number(it.shippingFee) || 0) * (Number(it.quantity) || 1), 0);
    return baseZoneRate + totalSurcharges;
  }

  // Default: 'MAX_OF_ZONE_AND_PRODUCTS' -> takes whichever is higher between zone rate and max product shipping fee
  return Math.max(baseZoneRate, maxProductFee);
}
