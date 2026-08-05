# COVERAGE.md

## Component registry

13 registered types, defined once in `src/core/constants/componentTypes.ts` and enforced at compile time — a `tsc`-checked assertion (`_typesInSync` in `sdui/schema/types.ts`) fails the build if this list and the zod discriminated union ever drift apart, so the two can't silently disagree.

| Type | Renders | Used in |
|---|---|---|
| `header_search` | Location, search bar, category tabs | home |
| `card_rail` | Horizontal rail of generic image+title cards | home |
| `car_listing_rail` | Horizontal rail of car cards (price, EMI, specs, badge), optional tab toggle | home, car_detail |
| `feature_list` | Vertical list, icon + title + description per row | car_detail (×2) |
| `spec_grid` | Label/value grid, configurable columns | car_detail |
| `icon_link_grid` | Icon + label grid, configurable columns | car_detail |
| `promo_banner` | Eyebrow + title + subtitle + background image | car_detail |
| `image_gallery` | Swipeable image carousel with badge/overlay text | car_detail |
| `location_card` | Name, address, distance, primary/secondary actions | car_detail |
| `tabbed_content` | Tab bar switching between generic label/value item lists | car_detail |
| `emi_calculator` | EMI calculator with two independent sliders (down payment, duration) and live recalculation | car_detail |
| `link_list` | Vertical list of eyebrow+label navigational rows | car_detail |
| `text_block` | Plain text, configurable alignment and height | home (×2) |

## What the schema expresses

- **Lists** — `feature_list`, `link_list`, and each `tabbed_content` tab's items are all JSON-driven arrays of arbitrary length.
- **Grids** — `spec_grid` and `icon_link_grid` both take a `columns` value (2–4) and lay out their `items` array accordingly; no new component is needed to go from a 3-column to a 4-column grid.
- **Horizontal rails** — `card_rail` and `car_listing_rail` both support pagination fields (`cursor`, `hasMore`, `loadMoreAction`) in the schema, though no current screen's mock data exercises more than a single page.
- **Actions** — four types (`navigate`, `track`, `open_url`, `update_state`), expressed as arrays per interactive element rather than single objects, which is what supports chaining (a tap firing a `track` and a `navigate` in sequence, verified via the EMI calculator's eligibility button). Navigation targets are checked against an explicit allow-list before anything happens.
- **Conditionals** — partial. Each section carries a `visible` boolean, computed server-side and respected by the client; there's no client-side expression language, so "show this only if X" logic has to live on the server, not in the JSON itself.
- **Styling overrides** — partial. Each section accepts `style.backgroundColor` and `style.textColor`, applied at the section wrapper (used on the home page's footer and the `emi_calculator`'s text color). There's no per-field style override inside a component's own internal styling — a component's internal layout and spacing are fixed by its implementation, not JSON-configurable.
- **Accessibility** — each section accepts `accessibilityLabel` and `accessibilityRole`, passed through to the wrapping view.
- **Versioning** — each section accepts an optional `minVersion`; see `README.md` for how this fits into the fallback story.

## Coverage claim

**Given a new Cars24 screen with a section mix broadly similar to what's built here, an estimated 65–75% would render with JSON-only changes against the current 13-type registry. Patterns needing a filter/sort bar, a data-entry form, a map, or a dual-thumb range control would need new client code — rails, grids, lists, banners, galleries, spec tables, and tab switchers are already expressible.**

That estimate is a prediction for the live round, not a measured result — there's no third screen in this repo to test it against. It rests on one number that *is* measured: 11 of the current 13 component types are generic content shapes with no car-specific assumptions in their rendering logic; only 2 (`car_listing_rail`, `emi_calculator`) are narrow to this domain. That ratio is the basis for the 65–75% figure.

**What is measured, exactly:** the home page was built first, using 4 component types. The car detail page was built second, deliberately without reusing any of the home page's JSON, specifically to stress-test generalization. Of its 11 sections, 1 (`car_listing_rail`, the "similar cars" rail) reused a type already established by the home page, and 1 more (`feature_list`, used in both "Great things about this car" and "Why choose Cars24?") reused a type introduced earlier within car_detail itself. The remaining 9 sections each introduced a brand-new component type — roughly **9% zero-new-code coverage** for the second screen against the registry as it stood before car_detail was built.

That 9% isn't a discouraging number; it's the honest cost of a registry that only knew one page shape being pointed at a structurally unrelated one. The result is what it grew into: a 13-type registry spanning both a listing-style page and a detail-style page without either screen needing a recursive schema or an escape hatch — and the basis for the 65–75% estimate above.

## Known gaps — patterns that would need new client code today

- **Recursive composition.** A `Section` wraps exactly one `Component`; there's no `children[]` nesting. A section needing two independent components inside one visual card would need either a new composite component or a schema change.
- **Range sliders with two thumbs.** `emi_calculator` uses two independent single-value sliders (down payment, duration) — matching what the real Cars24 app's EMI screen actually does — not a dual-handle range control. A UI pattern that genuinely needs one would need a new component.
- **Maps, video, or other native-heavy views.** Nothing in the current registry wraps a map or media player; either would be a new component type, not a schema extension.
- **Forms with client-side validation.** The registry has no input/form component beyond the (non-functional, visual-only) search bar in `header_search`. A screen requiring actual data entry would need new components and likely a schema extension for field-level validation rules.