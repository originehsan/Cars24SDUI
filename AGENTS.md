# AGENTS.md — Cars24 SDUI Assignment

Context/rules file for AI coding assistants (Claude Code, Cursor, etc.)
working on this project. Read this before generating any code.

## Project

Server-Driven UI (SDUI) system for Cars24's mobile take-home assignment.
Server sends JSON → client renders native UI from a component registry.
Goal: schema-driven, generalizable, production-quality — not a renderer
hardcoded to one screen.

## Stack (matches Cars24's own engineering conventions — do not deviate)

- React Native 0.86.2, New Architecture (Fabric) — already enabled by default
- TypeScript, strict mode
- State: Zustand for client/local state (sliders, tabs, wishlist toggle).
  TanStack Query for server/async state (SDUI JSON fetch + caching).
  Never use Redux.
- Styling: StyleSheet.create() only. Never use Tailwind/NativeWind.
- Components: functional components only. No class components —
  the ONE exception is react-error-boundary's internal implementation,
  which we consume via its functional <ErrorBoundary> wrapper, never
  hand-write a class ourselves.
- Lists: @shopify/flash-list (FlashList v2) for all rails/grids.
  Never use FlatList for anything with 20+ items. Never pass an inline
  arrow function to renderItem — define it outside the component or
  memoize with useCallback, and wrap item components in React.memo.
- Validation: zod discriminated unions for the SDUI schema.
  Every component type in the registry must have a matching zod schema.
- Slider: @react-native-community/slider (single-handle, used twice
  for the EMI calculator — down payment and duration are two SEPARATE
  sliders, not one dual-handle range slider).
- Offline cache: react-native-mmkv for caching the last-good SDUI
  JSON payload.

## Path aliases

Defined in both babel.config.js and tsconfig.json — they must always
be edited together, never one without the other:
- @core/*       -> src/core/*       (design-system, hooks, utils, theme, api, store)
- @sdui/*       -> src/sdui/*       (schema, registry, renderer, sdui components)
- @screens/*    -> src/screens/*
- @navigation/* -> src/navigation/*

## File structure rules

- Business logic goes in custom hooks (src/core/hooks/), never inline
  in components. Pure functions (e.g. EMI formula) go in src/core/utils/
  and must be unit-testable without any React/RN import.
- src/core/ui/ = dumb, reusable design-system primitives (Button, Card,
  Text, Image, Skeleton). No business logic, no navigation, no API calls.
  SDUI components in src/sdui/components/ must be BUILT FROM these
  primitives, not raw <View>/inline styles.
- Barrel exports (index.ts) are allowed but must use named exports
  only — never export *. Wildcard exports hurt tree-shaking and
  bundle size (verified: ~15-45% bundle bloat in real-world tests) and
  can hide circular dependencies. Keep barrels one level deep only.
- src/sdui/constants/componentTypes.ts (or src/core/constants/) is
  the single source of truth for component type strings — both the zod
  schema and the registry import from here. Never hardcode type strings
  in two places.

## SDUI-specific rules (non-negotiable)

- Never crash on an unknown component type. The registry must fall
  back to a placeholder component and log the event — this is a scored
  requirement, not optional polish.
- Validate each JSON node independently with safeParse. If one node
  fails validation, drop only that node and render the rest of the
  screen — never blank the whole screen for one bad node.
- Cap recursion depth when walking nested sections (protect against
  circular/malformed JSON).
- Wrap the SDUI renderer in react-error-boundary's <ErrorBoundary>
  as a second line of defense, even after schema validation.
- Any new SDUI component type = one new file + one registry line.
  Never modify the renderer/registry logic itself to add a type
  (Open/Closed principle — this is explicitly judged in the assignment).

## Testing

- Jest + React Native Testing Library, test files colocated
  (Component.test.tsx next to Component.tsx).
- Always include: a test that malformed JSON doesn't crash the renderer,
  and a test that an unknown component type renders the fallback.
- Detox for E2E if time allows (not required for the 72h scope).

## Commands

npx react-native run-android   -- build + install on connected device
.\gradlew clean                -- from android/ folder, when native build is stuck
tsc --noEmit                   -- type-check without emitting files

## Known environment gotchas (do not "fix" these differently)

- NDK is pinned to 26.1.10909125 in android/build.gradle
  (NOT the auto-installed 27.1.12297006) — NDK 27+ has a Windows-only
  C++ linking bug. Do not change this without re-verifying both the
  linking bug AND the std::format issue below are still resolved.
- graphicsConversions.h in the react-android prefab package was
  manually patched (std::format -> snprintf) to work around an RN 0.86.2
  + NDK 26 incompatibility. This patch lives in the Gradle cache and is
  lost if the cache is cleared — if native build errors reappear
  mentioning std::format, re-apply the patch (see AI_WORKFLOW.md for
  the exact diff).

## Verification checklist before treating any AI-generated code as done

1. tsc --noEmit passes
2. ESLint passes
3. New dependency? Confirm it exists on npm and is actively maintained
   before installing — do not trust a package name suggested by AI
   without checking.
4. Test on the real connected device, not just assumptions from code
   review.