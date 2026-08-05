import { colors } from './tokens';

interface BadgeColorSet {
  background: string;
  text: string;
}

const BADGE_COLOR_RULES: { match: string; colors: BadgeColorSet }[] = [
  { match: 'owned', colors: { background: colors.primary, text: colors.textOnPrimary } },
  { match: 'verified', colors: { background: colors.verified, text: colors.textOnPrimary } },
  { match: 'zero worry', colors: { background: colors.accentSecondary, text: colors.textOnPrimary } },
];

const DEFAULT_BADGE_COLORS: BadgeColorSet = {
  background: colors.primary,
  text: colors.textOnPrimary,
};

/**
 * Maps badge text to a color pair by keyword, not exact string match —
 * server copy can vary ("Cars24 Owned stock" vs "Cars24 Owned") while
 * remaining the same semantic badge. Unrecognized text falls back to
 * the default rather than breaking, since a future screen may send
 * badge text this hasn't seen before.
 */
export function resolveBadgeColors(badgeText: string): BadgeColorSet {
  const lower = badgeText.toLowerCase();
  const rule = BADGE_COLOR_RULES.find((r) => lower.includes(r.match));
  return rule ? rule.colors : DEFAULT_BADGE_COLORS;
}