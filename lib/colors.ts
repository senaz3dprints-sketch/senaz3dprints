export interface FilamentColor {
  name: string;
  hex: string;
  border?: string;
  isDark?: boolean;
}

export const STANDARD_FILAMENT_COLORS: FilamentColor[] = [
  { name: 'Matte Black', hex: '#12161f', border: '#374151', isDark: true },
  { name: 'Pure White', hex: '#ffffff', border: '#cbd5e1', isDark: false },
  { name: 'Stealth Grey', hex: '#64748b', border: '#475569', isDark: true },
  { name: 'Silk Gold', hex: '#d4af37', border: '#b89628', isDark: false },
  { name: 'Silk Silver', hex: '#c0c0c0', border: '#94a3b8', isDark: false },
  { name: 'Silk Bronze / Copper', hex: '#b45309', border: '#92400e', isDark: true },
  { name: 'Fire Red', hex: '#dc2626', border: '#b91c1c', isDark: true },
  { name: 'Crimson Red', hex: '#991b1b', border: '#7f1d1d', isDark: true },
  { name: 'Royal Blue', hex: '#2563eb', border: '#1d4ed8', isDark: true },
  { name: 'Deep Navy Blue', hex: '#1e3a8a', border: '#172554', isDark: true },
  { name: 'Electric Cyan', hex: '#06b6d4', border: '#0891b2', isDark: false },
  { name: 'Emerald Green', hex: '#059669', border: '#047857', isDark: true },
  { name: 'Vibrant Lime Green', hex: '#84cc16', border: '#65a30d', isDark: false },
  { name: 'Sunset Orange', hex: '#ea580c', border: '#c2410c', isDark: true },
  { name: 'Golden Yellow', hex: '#eab308', border: '#ca8a04', isDark: false },
  { name: 'Electric Purple', hex: '#9333ea', border: '#7e22ce', isDark: true },
  { name: 'Lavender Violet', hex: '#a855f7', border: '#9333ea', isDark: true },
  { name: 'Bubblegum Pink', hex: '#ec4899', border: '#db2777', isDark: true },
  { name: 'Wood Brown', hex: '#78350f', border: '#5b21b6', isDark: true },
  { name: 'Glow in Dark Green', hex: '#86efac', border: '#4ade80', isDark: false },
  { name: 'Rainbow Multi-Color', hex: 'linear-gradient(135deg, #ef4444, #eab308, #10b981, #3b82f6, #8b5cf6)', border: '#6366f1', isDark: true },
];

const COLOR_MAP: Record<string, string> = {
  black: '#12161f',
  'matte black': '#12161f',
  'obsidian black': '#12161f',
  white: '#ffffff',
  'pure white': '#ffffff',
  'arctic white': '#ffffff',
  grey: '#64748b',
  gray: '#64748b',
  'stealth grey': '#64748b',
  gold: '#d4af37',
  'silk gold': '#d4af37',
  silver: '#c0c0c0',
  'silk silver': '#c0c0c0',
  bronze: '#b45309',
  copper: '#b45309',
  red: '#dc2626',
  'fire red': '#dc2626',
  'ruby red': '#ef4444',
  'crimson red': '#991b1b',
  blue: '#2563eb',
  'royal blue': '#2563eb',
  'navy blue': '#1e3a8a',
  'deep navy': '#1e3a8a',
  cyan: '#06b6d4',
  'electric cyan': '#06b6d4',
  green: '#059669',
  'emerald green': '#059669',
  'lime green': '#84cc16',
  lime: '#84cc16',
  orange: '#ea580c',
  'sunset orange': '#ea580c',
  yellow: '#eab308',
  purple: '#9333ea',
  violet: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  brown: '#78350f',
  wood: '#78350f',
  'glow green': '#86efac',
  'glow in dark': '#86efac',
};

export function getFilamentColorStyle(colorName: string): { background: string; border?: string } {
  if (!colorName) return { background: '#64748b' };
  const lower = colorName.toLowerCase().trim();
  
  if (lower.includes('rainbow') || lower.includes('multi')) {
    return {
      background: 'linear-gradient(135deg, #ef4444, #eab308, #10b981, #3b82f6, #8b5cf6)',
      border: '1px solid #818cf8',
    };
  }

  // Exact match
  if (COLOR_MAP[lower]) {
    return { 
      background: COLOR_MAP[lower],
      border: lower.includes('white') ? '1px solid #cbd5e1' : undefined
    };
  }

  // Substring match
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) {
      return { 
        background: val,
        border: key.includes('white') ? '1px solid #cbd5e1' : undefined
      };
    }
  }

  return { background: '#475569' };
}
