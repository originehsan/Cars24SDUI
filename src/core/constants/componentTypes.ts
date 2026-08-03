/**
 * Single source of truth for SDUI component type strings.
 * Both the zod schema (sdui/schema/types.ts) and the component
 * registry (sdui/registry/componentRegistry.ts) import from here.
 * Never hardcode these strings anywhere else — adding a new SDUI
 * component type means adding one entry here, nowhere else.
 */
export const COMPONENT_TYPES = [
  'header_search',
  'icon_link_grid',
  'card_rail',
  'car_listing_rail',
  'promo_banner',
  'location_card',
  'feature_list',
  'spec_grid',
  'tabbed_content',
  'image_gallery',
  'emi_calculator',
  'text_block',
  'link_list',
] as const;

export type ComponentType = (typeof COMPONENT_TYPES)[number];

/** Runtime check: is this string a recognized component type? */
export function isComponentType(value: string): value is ComponentType {
  return (COMPONENT_TYPES as readonly string[]).includes(value);
}