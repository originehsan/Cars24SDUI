import type { ComponentType } from '@core/constants/componentTypes';
import { UnknownComponentFallback } from './fallback';
import * as Placeholders from '@sdui/components';

/**
 * Maps each SDUI component type to the React component that renders it.
 * Adding a new type = one new component file + one line here.
 * Never modify the renderer to add a type (Open/Closed principle).
 */
export const componentRegistry: Record<ComponentType, React.ComponentType<any>> = {
  header_search: Placeholders.HeaderSearch,
  icon_link_grid: Placeholders.IconLinkGrid,
  card_rail: Placeholders.CardRail,
  car_listing_rail: Placeholders.CarListingRail,
  promo_banner: Placeholders.PromoBanner,
  location_card: Placeholders.LocationCard,
  feature_list: Placeholders.FeatureList,
  spec_grid: Placeholders.SpecGrid,
  tabbed_content: Placeholders.TabbedContent,
  image_gallery: Placeholders.ImageGallery,
  emi_calculator: Placeholders.EmiCalculator,
  text_block: Placeholders.TextBlock,
  link_list: Placeholders.LinkList,
};

/** Registry lookup with fallback — this is the "never crash" guarantee. */
export function resolveComponent(type: string): React.ComponentType<any> {
  if (type in componentRegistry) {
    return componentRegistry[type as ComponentType];
  }
  // Unknown type — log for analytics (hook up once useAnalytics exists) and
  // fall back instead of crashing.
  console.warn(`[SDUI] Unknown component type: "${type}"`);
  return UnknownComponentFallback;
}