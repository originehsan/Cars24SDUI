# Cars24 SDUI

A Server-Driven UI system built for the Cars24 Mobile Engineering assignment. The server sends JSON; the client renders the full page from it. Layout changes ship as JSON updates, not app releases.

## Setup

```bash
npm install
npx react-native run-android
```

Requirements: Node 22.11+, JDK 17, Android SDK, NDK 27.1.12297006.

Native patches for several dependencies (Reanimated, Gesture Handler, MMKV, Nitro Modules, Screens, Worklets) are managed with `patch-package` and reapply automatically on `npm install` via the `postinstall` script — no manual steps needed.

## Screens

**Home page** (primary build) and **Car Detail page** (secondary, built independently of the home page's JSON to test generalization).

The home page was chosen because it clears the assignment's complexity bar on its own: a header/search block, promotional rails, a tab-toggled car-listing rail, and a footer — five-plus visually distinct section types, both a horizontal rail and grid-style content, and a tappable card with a navigation intent. The car detail page was built second and deliberately reuses none of the home page's JSON, so it functions as a genuine test of whether the schema generalizes rather than replaying known-good data — it also stands in for the "screen you didn't build" scenario the assignment describes.

Across both screens, 13 component types cover 15 section instances, two reused across both screens (`feature_list` powers both "Great things about this car" and "Why choose Cars24?"; `icon_link_grid` powers both the inspection-report grid and the home page's service grids). This reuse is the basis for the coverage claim in `COVERAGE.md`.

## Architecture

Three-tier schema: **Screen → Section → Component**. This structure is not novel — it is the pattern that Airbnb (Ghost Platform), DoorDash (Facets), and Faire converged on independently for the same problem. The schema, component set, and renderer here were designed and built from scratch for this assignment; no external SDUI library code was used.

```
src/
  core/
    ui/          Design-system primitives (Button, Card, Text) — no
                 business logic, no navigation, no API calls
    theme/       Design tokens (colors, spacing, typography)
    hooks/       Business logic (useSduiScreen)
    api/         Service layer — fetch + validate (sduiService.ts)
    store/       Zustand — local UI state (e.g. bottom sheet visibility)
    utils/       Pure functions (EMI formula, perf timers)
    constants/   Single source of truth for component type strings
  sdui/
    schema/      zod discriminated-union schema (types.ts)
    registry/    Component registry, renderer, fallback, error boundary
    components/  The 13 SDUI component implementations
    actions/     Action handler — navigate whitelist, chaining, tracking
    mock-server/ home.json, car_detail.json
  static-screen/ Hardcoded, non-SDUI twin of the home page (for PERF.md)
  screens/       Screen-level containers (data fetching + loading states)
  navigation/    React Navigation stack, bottom sheet mount point
```

Data flow: `Screen` component → `useSduiScreen` hook → TanStack Query → `sduiService.fetchScreen()` → mock JSON (swappable for a real endpoint by editing one file) → `SDUIScreen` renderer → per-section validation → component registry lookup → rendered UI.

### Schema

Zod discriminated union keyed on a `type` field, validated with `safeParse`. Each section carries `id`, `visible`, an optional `minVersion`, optional section-level `style` and `accessibility`, and a `component` object (`type`, `id`, `props`). Actions are arrays (`Action[]`) rather than single objects, which is what supports chaining — a single tap can fire a `track` event and a `navigate` in sequence.

Validation happens in two stages per section, not one: a cheap, zod-free property read first determines whether the `type` is recognized at all (genuinely unknown types render the fallback component immediately); only recognized types go through full schema validation (malformed props on a known type are dropped, logged, and the rest of the screen renders unaffected). This keeps the unknown-component and malformed-data paths independent, matching the assignment's fallback requirement.

The schema is intentionally flat — a `Section` wraps exactly one `Component`, with no recursive `children[]`. Every section observed across both built screens was a self-contained unit; none required arbitrary internal composition of multiple independent components inside one card. A recursive model would generalize further at the cost of added complexity in the registry and renderer; it was scoped out as unnecessary for the sections this system was built against, and is the first extension point if a future screen needs it.

### Component registry

`src/sdui/registry/componentRegistry.ts` maps each type string to its React component. Adding a new type is one new component file plus one registry line — the registry and renderer are never modified to add a type.

### Actions

Four action types: `navigate`, `track`, `open_url`, `update_state`. Navigation targets are checked against an explicit allow-list before anything happens — the client never navigates to an arbitrary server-provided string. The EMI calculator's tenure and down-payment sliders fire a `track` action on release (not on every drag event) while the EMI figure itself updates from client-held state; this is a deliberate boundary — the calculation is local, but the interaction remains observable and driven by the same action pipeline as the rest of the system.

### Bottom sheet

Tapping "Check eligibility" in the EMI calculator fires a `track`/`navigate` action pair and opens a bottom sheet (`@gorhom/bottom-sheet`). The sheet is mounted once near the navigation root and controlled through a small Zustand store rather than a ref passed into the SDUI component tree — this keeps the sheet's presence a concern of the navigation layer, not of the otherwise-dumb SDUI component that triggers it.

### Unknown-component fallback

A section with an unrecognized `type` renders a visible fallback (component type and id shown) instead of being dropped or crashing the screen. This is demonstrated live in `home.json` and covered by the schema-contract tests.

### Versioning

Each section carries an optional `minVersion` field. The implemented behavior is client-side: the component registry falls back gracefully for any type it doesn't recognize, which is what lets an old client survive a new component type appearing in the server payload without crashing.

The production extension of this — not implemented here, per the assignment's own scope allowance for this section — is server-side capability negotiation: the client sends its app version, schema version, and platform in a request header; the server uses that to decide what to include in the response (omit a component the client can't render, or substitute a simpler fallback component for it server-side). That keeps the compatibility decision centralized and auditable rather than distributed across client versions in the wild. The client-side registry fallback implemented here is the necessary complement to that story — it's what protects a client against any gap in that server-side logic, or against payloads from a server that hasn't been updated to be version-aware at all.

## Trade-offs and scope decisions

- **Flat schema, no recursive nesting** — covered above. Would generalize further; not needed for the screens built here.
- **Tab-switching is local UI state, not JSON-driven.** The "Wishlisted / Hot deals" and "Features / Specifications" toggles use component-local state rather than firing an SDUI action on selection. The assignment's interactive-element requirement is met through the navigation-intent path instead (tapping a car card fires a `navigate` action, verified via the action handler). Making tab content itself swap based on a server-driven `update_state` action would be a natural next step if tab content needed to vary per-request rather than being present in the initial payload.
- **EMI calculation is client-side; the tenure interaction is action-observable.** Covered under Actions above.
- **Section-level styling only.** `style` overrides (`backgroundColor`, `textColor`) apply at the section wrapper, not as deep per-field overrides inside each component's internal styling. This covers every real case found across both screens; a component-level style-override system would be the next extension if a screen needed finer control.
- **Conditional rendering is a boolean flag, not an expression language.** `visible` is computed server-side and sent as `true`/`false` — there's no client-side condition evaluation. This matches how every production SDUI system reviewed for this assignment handles it (the server, which has the user/session context, decides visibility; the client just respects the flag).
- **No i18n/RTL implementation.** Single-language, LTR only. Content strings arrive from JSON already, so localizing content is a server-side concern; RTL layout support would require auditing every component's directional styles, which was out of scope for this timebox.
- **Lists use `ScrollView`, not FlashList.** Every list in both screens tops out around 10 items — well under the ~50-item threshold where FlashList's windowing starts to matter. `@shopify/flash-list` is the documented choice in `AGENTS.md` once list sizes grow; it wasn't pulled into any component here because nothing in this dataset needs it yet.

## Stack

React Native 0.86.2, New Architecture (Fabric). TypeScript throughout. Zustand for local UI state, TanStack Query for server state — no Redux. `StyleSheet.create()` for styling — no Tailwind/NativeWind. Functional components only, including the error boundary (via `react-error-boundary`'s wrapper rather than a hand-written class component). React Navigation (native-stack) for routing. `@gorhom/bottom-sheet` for the EMI eligibility sheet. This combination — Zustand/TanStack Query over Redux, `StyleSheet` over Tailwind, functional components only — also matches Cars24's own published engineering conventions.

NDK is pinned to 27.1.12297006 with an explicit `-lc++_shared` linker flag, required for a Windows-specific CMake/Ninja toolchain issue on this NDK version; see `AGENTS.md` for the specific configuration.

## Related documents

- `PERF.md` — SDUI vs. static benchmark, methodology, and results
- `COVERAGE.md` — component registry, expressible UI patterns, and the coverage claim
- `AI_WORKFLOW.md` — tools, prompt/outcome examples, and verification approach
- `AGENTS.md` — context file used to brief the AI coding assistant on this project's conventions