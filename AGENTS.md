# AGENTS.md — Cars24 SDUI Assignment

Context/rules file for AI coding assistants (Claude Code, Cursor, etc.)
working on this project. Read this before generating any code.

This file overrides generic React Native or JavaScript best practices
you may default to. If something here conflicts with a pattern you've
seen in public examples or documentation, follow this file.

## Project

Server-Driven UI (SDUI) system for Cars24's mobile take-home assignment.
Server sends JSON → client renders native UI from a component registry.
Goal: schema-driven, generalizable, and extensible — not a renderer
hardcoded to one screen.

## Stack (also matches conventions from Cars24's public engineering blog — do not deviate)

Do not add a new dependency to solve a problem the existing stack
already handles. Check what's already installed before reaching for
a new package.

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
- Lists: ScrollView for anything under ~50 items (every list in this
  project currently tops out around 10). @shopify/flash-list (FlashList
  v2) is the documented choice once a list's item count grows past
  that threshold, or profiling shows ScrollView struggling — install
  and wire it in only when a screen actually needs it, not preemptively.
  If FlashList is used, never pass an inline arrow function to
  renderItem — define it outside the component or memoize with
  useCallback, and wrap item components in React.memo.
- Validation: zod discriminated unions for the SDUI schema.
  Every component type in the registry must have a matching zod schema.
- Slider: @react-native-community/slider (single-handle, used twice
  for the EMI calculator — down payment and duration are two SEPARATE
  sliders, not one dual-handle range slider).
- Offline cache: react-native-mmkv is installed as a dependency. The
  caching logic itself (writing/reading the last-good SDUI JSON
  payload) has not been implemented yet — do not assume it exists
  when reasoning about fetch/offline behavior. If implementing it,
  wire it into src/core/api/sduiService.ts as a fallback when the
  network fetch fails.

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
  and must be unit-testable without any React/RN import. If unsure
  whether something belongs in a hook or a component, put it in a hook.
- src/core/ui/ = dumb, reusable design-system primitives (Button, Card,
  Text, Image, Skeleton). No business logic, no navigation, no API calls.
  SDUI components in src/sdui/components/ must be BUILT FROM these
  primitives, not raw <View>/inline styles.
- Barrel exports (index.ts) are allowed but must use named exports
  only — never export *. Wildcard exports can increase bundle size
  and make circular dependencies harder to detect. Keep barrels one
  level deep only.
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
- The schema is flat by design — a Section wraps exactly one Component,
  no children[] nesting (see README.md's Schema section for why). There
  is currently nothing to walk recursively. If recursive composition is
  introduced later, cap traversal depth at that point to guard against
  circular/malformed payloads — don't add this now for a case that
  doesn't exist yet.
- Wrap the SDUI renderer in react-error-boundary's <ErrorBoundary>
  as a second line of defense, even after schema validation.
- Any new SDUI component type = one new file + one registry line.
  Adding a type is additive only — never modify the renderer or
  registry logic itself to add one.
- When a new screen's content doesn't fit existing components, prefer
  extending the schema (a new component type, a new optional prop) over
  adding conditionals in a component that only apply to one screen.
  Logic that only works for one specific screen belongs in that
  screen's JSON data, not in component code.
- Never replace an existing abstraction because a simpler version
  seems possible. Prefer extending the current architecture; if you
  think something should be removed or restructured, say so and wait
  for confirmation rather than doing it.

## Testing

No automated tests exist in this project yet (`npm test` — verify
before assuming otherwise). The two behaviors this section used to
prescribe as test cases were instead verified manually, on-device,
with logged evidence: malformed JSON on a known component type is
dropped without crashing the screen (confirmed via `adb logcat`
grep for the renderer's drop-warning), and an unknown component type
renders the fallback component (confirmed visually and via the same
log). See `AI_WORKFLOW.md`, Story 3, for the exact test payloads used.

If automated tests are added later: Jest + React Native Testing
Library, test files colocated (Component.test.tsx next to
Component.tsx). Start with the two cases above, since they already
have known-good expected behavior to assert against. Detox for E2E
if time allows — not required for the 72h scope.

## Commands

npx react-native run-android          -- build + install on connected device
.\gradlew assembleRelease             -- from android/ folder, build release APK
.\gradlew clean                       -- from android/ folder, when native build is stuck
Remove-Item -Recurse -Force app\.cxx  -- PowerShell, from android/ folder; clears stale
                                         CMake/Ninja cache when build fails with
                                         "ninja: error: failed recompaction: Permission denied"
npx tsc --noEmit                      -- type-check without emitting files

## Known environment gotchas (do not "fix" these differently)

- NDK is pinned to 27.1.12297006 in android/build.gradle.
  RN 0.86.2 core headers (graphicsConversions.h) use C++20 std::format,
  which requires NDK 27+ (Clang 18). NDK 26 (Clang 17) had partial
  <format> support that failed to compile against folly::dynamic.
  Do NOT downgrade to NDK 26.

- CMake is pinned to 3.31.6 in android/app/build.gradle via
  externalNativeBuild { cmake { version "3.31.6" } }.
  The default CMake 3.22.1 bundled with AGP ships Ninja 1.10.2, which
  fails on Windows with "Filename longer than 260 characters" for deeply
  nested autolinked native builds (e.g. react-native-gesture-handler).
  CMake 3.31.6 bundles Ninja 1.12+ which handles long paths correctly.
  CMake 3.31.6 must be installed via Android SDK Manager:
    sdkmanager "cmake;3.31.6"

- NDK 27 + libc++_shared linking: The NDK 27 unified toolchain does not
  auto-link "-lc++_shared" for ANDROID_STL=c++_shared. Without an
  explicit flag, the final link fails with "undefined symbol" for
  std::string, __cxa_guard_acquire, operator new, etc.
  Fix already applied in android/app/build.gradle defaultConfig:
    cmake { arguments "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared" }

- ninja: error: failed recompaction: Permission denied
  Happens when a previous Gradle/Ninja build was killed mid-flight
  (e.g. via task cancellation), leaving a partially-written build.ninja
  file in android/app/.cxx that the next build cannot overwrite.
  Fix: from the android/ folder, run:
    Remove-Item -Recurse -Force app\.cxx
  Then re-run the build. Do NOT run gradlew clean for this — it won't
  remove .cxx (that's a CMake output dir, not a Gradle output dir).

- react-native-reanimated 4.5.3 constrained template patch (HISTORICAL):
  Previously patched TransformOperationInterpolator.h/.cpp to move
  ResolvableOp-constrained partial specialization bodies inline, to work
  around a Clang 17 (NDK 26) bug. Now that NDK 27 (Clang 18) is in use,
  this patch is no longer needed for new builds. The patched files remain
  in node_modules as-is (they are still valid C++ on Clang 18). If
  reanimated is reinstalled or upgraded, no re-patching is required.

- Native module patches (react-native-gesture-handler, react-native-mmkv,
  react-native-nitro-modules, react-native-reanimated,
  react-native-screens, react-native-worklets) live in patches/ and
  reapply automatically via patch-package on npm install (see the
  postinstall script in package.json). Do not manually edit files in
  node_modules to fix a native issue — check patches/ first, and add
  a new patch there via patch-package rather than a one-off edit that
  won't survive the next install.

## Verification checklist before treating any AI-generated code as done

1. npx tsc --noEmit passes
2. ESLint passes
3. New dependency? Confirm it exists on npm and is actively maintained
   before installing — do not trust a package name suggested by AI
   without checking.
4. Test on the real connected device, not just assumptions from code
   review.