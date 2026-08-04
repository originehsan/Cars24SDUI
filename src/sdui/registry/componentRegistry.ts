import type { ComponentType } from '@core/constants/componentTypes';
import { UnknownComponentFallback } from './fallback';
import { HeaderSearch } from '@sdui/components/HeaderSearch';
import { CardRail } from '@sdui/components/CardRail';
import { CarListingRail } from '@sdui/components/CarListingRail';
import { TextBlock } from '@sdui/components/TextBlock';
import { IconLinkGrid } from '@sdui/components/IconLinkGrid';
import { PromoBanner } from '@sdui/components/PromoBanner';
import { LocationCard } from '@sdui/components/LocationCard';
import { FeatureList } from '@sdui/components/FeatureList';
import { SpecGrid } from '@sdui/components/SpecGrid';
import { TabbedContent } from '@sdui/components/TabbedContent';
import { ImageGallery } from '@sdui/components/ImageGallery';
import { EmiCalculator } from '@sdui/components/EmiCalculator';
import { LinkList } from '@sdui/components/LinkList';

/**
 * Maps each SDUI component type to the React component that renders it.
 * Adding a new type = one new component file + one line here.
 * Never modify the renderer to add a type (Open/Closed principle).
 */
export const componentRegistry: Record<ComponentType, React.ComponentType<any>> = {
  header_search: HeaderSearch,
  icon_link_grid: IconLinkGrid,
  card_rail: CardRail,
  car_listing_rail: CarListingRail,
  promo_banner: PromoBanner,
  location_card: LocationCard,
  feature_list: FeatureList,
  spec_grid: SpecGrid,
  tabbed_content: TabbedContent,
  image_gallery: ImageGallery,
  emi_calculator: EmiCalculator,
  text_block: TextBlock,
  link_list: LinkList,
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