// Design tokens derived from Cars24 app screenshots (not exact brand
// values — this is a portfolio/assignment clone, not the real brand kit).
// core/ui components import ONLY from here, never hardcode colors/spacing.

export const colors = {
  // Brand
  primary: '#3D34C4',      // header bar, primary buttons, links
  primaryDark: '#2A2389',  // pressed states
  accent: '#F58020',       // CTA buttons (Book now, Free test drive)
  accentLight: '#FCEBDD',  // CTA secondary background

  // Semantic
  success: '#1D9E75',      // Zero Worry badges, verified tags
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