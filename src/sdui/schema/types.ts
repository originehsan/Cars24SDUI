import { z } from 'zod';
import type { ComponentType } from '@core/constants/componentTypes';

// ---------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------

export const ActionSchema = z.object({
    type: z.enum(['navigate', 'track', 'open_url', 'update_state']),
    target: z.string().optional(),
    params: z.record(z.string(), z.unknown()).optional(),
});
export type Action = z.infer<typeof ActionSchema>;

const ActionsSchema = z.array(ActionSchema).min(1).optional();

const AccessibilitySchema = z.object({
    accessibilityLabel: z.string().optional(),
    accessibilityRole: z.string().optional(),
});

const StyleSchema = z
    .object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
    })
    .optional();

const PaginationSchema = z
    .object({
        cursor: z.string().optional(),
        hasMore: z.boolean().default(false),
        loadMoreAction: ActionsSchema,
    })
    .optional();

const CarCardSchema = z.object({
    id: z.string(),
    title: z.string(),
    variant: z.string().optional(),
    imageUrl: z.string(),
    price: z.string(),
    emi: z.string().optional(),
    km: z.string().optional(),
    fuel: z.string().optional(),
    transmission: z.string().optional(),
    badge: z.string().optional(),
    actions: ActionsSchema,
});

const IconLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    iconUrl: z.string().optional(),
    subtitle: z.string().optional(),
    actions: ActionsSchema,
});

// ---------------------------------------------------------------------
// Per-component prop schemas
// ---------------------------------------------------------------------

const HeaderSearchProps = z.object({
    location: z.string(),
    placeholder: z.string(),
    tabs: z.array(
        z.object({ id: z.string(), label: z.string(), iconUrl: z.string().optional() }),
    ),
});

const IconLinkGridProps = z.object({
    title: z.string().optional(),
    columns: z.number().int().min(2).max(4).default(3),
    items: z.array(IconLinkSchema),
});

const CardRailProps = z.object({
    title: z.string(),
    badgeText: z.string().optional(),
    viewAllActions: ActionsSchema,
    pagination: PaginationSchema,
    cards: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            imageUrl: z.string(),
            actions: ActionsSchema,
        }),
    ),
});

const CarListingRailProps = z.object({
    title: z.string(),
    tabs: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
    selectedTabId: z.string().optional(),
    viewAllActions: ActionsSchema,
    pagination: PaginationSchema,
    cars: z.array(CarCardSchema),
});

const PromoBannerProps = z.object({
    imageUrl: z.string().optional(),
    eyebrow: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    ctaLabel: z.string().optional(),
    actions: ActionsSchema,
});

const LocationCardProps = z.object({
    imageUrl: z.string().optional(),
    name: z.string(),
    address: z.string(),
    distanceLabel: z.string().optional(),
    statusLabel: z.string().optional(),
    primaryActions: ActionsSchema,
    secondaryActions: ActionsSchema,
});

const FeatureListProps = z.object({
    title: z.string().optional(),
    items: z.array(
        z.object({
            id: z.string(),
            iconUrl: z.string().optional(),
            title: z.string(),
            description: z.string().optional(),
            actions: ActionsSchema,
        }),
    ),
});

const SpecGridProps = z.object({
    title: z.string().optional(),
    columns: z.number().int().min(2).max(3).default(3),
    items: z.array(z.object({ label: z.string(), value: z.string() })),
});

const TabbedContentProps = z.object({
    tabs: z.array(
        z.object({
            id: z.string(),
            label: z.string(),
            items: z.array(
                z.object({
                    label: z.string(),
                    value: z.string().optional(),
                    iconUrl: z.string().optional(),
                }),
            ),
        }),
    ),
    defaultTabId: z.string().optional(),
});

const ImageGalleryProps = z.object({
    images: z.array(z.string()),
    badgeText: z.string().optional(),
    overlayText: z.string().optional(),
});

const EmiCalculatorProps = z.object({
    principal: z.number(),
    interestRatePercent: z.number(),
    downPayment: z.object({ min: z.number(), max: z.number(), default: z.number() }),
    durationMonths: z.object({ min: z.number(), max: z.number(), default: z.number() }),
    eligibilityActions: ActionsSchema,
    tenureChangeActions: ActionsSchema,
});

const TextBlockProps = z.object({
    text: z.string(),
    align: z.enum(['left', 'center', 'right']).default('left'),
});

const LinkListProps = z.object({
    title: z.string().optional(),
    items: z.array(
        z.object({
            id: z.string(),
            eyebrow: z.string().optional(),
            label: z.string(),
            actions: ActionsSchema,
        }),
    ),
});

// ---------------------------------------------------------------------
// The discriminated union
// ---------------------------------------------------------------------

export const ComponentSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('header_search'), id: z.string(), props: HeaderSearchProps }),
    z.object({ type: z.literal('icon_link_grid'), id: z.string(), props: IconLinkGridProps }),
    z.object({ type: z.literal('card_rail'), id: z.string(), props: CardRailProps }),
    z.object({ type: z.literal('car_listing_rail'), id: z.string(), props: CarListingRailProps }),
    z.object({ type: z.literal('promo_banner'), id: z.string(), props: PromoBannerProps }),
    z.object({ type: z.literal('location_card'), id: z.string(), props: LocationCardProps }),
    z.object({ type: z.literal('feature_list'), id: z.string(), props: FeatureListProps }),
    z.object({ type: z.literal('spec_grid'), id: z.string(), props: SpecGridProps }),
    z.object({ type: z.literal('tabbed_content'), id: z.string(), props: TabbedContentProps }),
    z.object({ type: z.literal('image_gallery'), id: z.string(), props: ImageGalleryProps }),
    z.object({ type: z.literal('emi_calculator'), id: z.string(), props: EmiCalculatorProps }),
    z.object({ type: z.literal('text_block'), id: z.string(), props: TextBlockProps }),
    z.object({ type: z.literal('link_list'), id: z.string(), props: LinkListProps }),
]);

export type SduiComponent = z.infer<typeof ComponentSchema>;

// ---------------------------------------------------------------------
// Section + Screen wrappers
// ---------------------------------------------------------------------

export const SectionSchema = z.object({
    id: z.string(),
    minVersion: z.string().optional(),
    visible: z.boolean().default(true),
    style: StyleSchema,
    accessibility: AccessibilitySchema.optional(),
    component: ComponentSchema,
});
export type Section = z.infer<typeof SectionSchema>;

export const ScreenSchema = z.object({
    schemaVersion: z.string(),
    screenName: z.string(),
    sections: z.array(SectionSchema),
});
export type Screen = z.infer<typeof ScreenSchema>;

// ---------------------------------------------------------------------
// Compile-time guard: keeps this file's types in sync with
// componentTypes.ts (the single source of truth). If they ever drift,
// tsc fails here instead of silently letting the two lists disagree.
// ---------------------------------------------------------------------
type SchemaTypes = SduiComponent['type'];
type _AssertInSync = ComponentType extends SchemaTypes
    ? SchemaTypes extends ComponentType
    ? true
    : never
    : never;
const _typesInSync: _AssertInSync = true;
void _typesInSync;


// ---------------------------------------------------------------------
// Lenient top-level check: validates the screen's shell (does it have
// a version, name, and a sections array?) WITHOUT validating each
// section's internal shape. Per-section validation happens separately
// in the renderer, so one malformed section can be dropped individually
// instead of failing the whole screen.
// ---------------------------------------------------------------------
export const ScreenShellSchema = z.object({
    schemaVersion: z.string(),
    screenName: z.string(),
    sections: z.array(z.unknown()),
});

// Loose section shell — checks the section's structure and that
// component.type/id exist, WITHOUT validating type-specific props.
// Used to tell "genuinely unknown type" (show fallback) apart from
// "known type, malformed props" (drop that node quietly).
export const SectionShellSchema = z.object({
  id: z.string(),
  minVersion: z.string().optional(),
  visible: z.boolean().default(true),
  style: StyleSchema,
  accessibility: AccessibilitySchema.optional(),
  component: z.object({
    type: z.string(),
    id: z.string(),
    props: z.unknown(),
  }),
});