// Design tokens derived from Cars24 app screenshots (not exact brand
// values — this is a portfolio/assignment clone, not the real brand kit).
// core/ui components import ONLY from here, never hardcode colors/spacing.

export const colors = {
  // Brand
  primary: '#4B3FE0',          // header bar, active tabs, primary badges
  primaryDark: '#372DB0',      // pressed states
  accent: '#F5820B',           // CTA buttons (Book now, Free test drive)
  accentLight: '#FFE8D6',      // CTA secondary background
  accentSecondary: '#7C3AED',  // purple accent — second feature_list variant
  accentSecondaryLight: '#F3EEFF',

  // Semantic
  success: '#1D9E75',          // positive-outcome banners (e.g. inspection pass)
  successLight: '#E3F6EE',
  info: '#1D63ED',             // trust/verification badges (Zero Worry-style)
  infoLight: '#E8F0FE',
  verified: '#E8590C',         // "Verified Direct seller" badge — distinct
  verifiedLight: '#FFF1EC',    // from accent; different semantic meaning
  warning: '#F59E0B',
  error: '#EF4444',

  // Neutrals
  background: '#F7F7F5',
  surface: '#FFFFFF',
  border: '#E5E5E0',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#9B9B9B',
  textOnPrimary: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  h3: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '500' as const },
} as const;