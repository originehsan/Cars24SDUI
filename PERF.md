# PERF.md

**At a glance:** Redmi Note 8 Pro, release build, 6 cold-start runs per screen. SDUI: 416.3ms total (316ms fetch, 22.7ms parse, 77.7ms view-build). Static: 202.7ms. Headline overhead is ~105% — but almost entirely from an artificial 300ms mock-network delay; excluding it, SDUI's own mechanism (100.4ms) is faster than the static screen's render. Scroll performance: near-zero jank on both (0.00%–0.10%). Full methodology, the counter-intuitive view-build finding, and what was tried below.

## Device and methodology

**Device:** Redmi Note 8 Pro, Android 10 (API 30) — mid-range hardware, comparable to the assignment's suggested reference class.

**Build:** Release APK (`assembleRelease`), not debug. This matters: an identical measurement on a debug build showed `parse` time at roughly 800ms versus 19ms on release — nearly 40× higher — because debug builds run unminified, with `__DEV__`-gated checks active and no bundle optimization. Every number in this document is from a release build; debug-build numbers are not representative and are not used for reporting here.

**Sampling:** Six cold-start runs per screen (fresh process each run — force-stopped and relaunched, not a warm reload). Where a session produced more than six readings, only the first six in original sequence were kept — none were selected for their value. A 90-second wait was observed after each APK install before the first measurement, since Android's background dexopt/verification step following an install otherwise inflates the first few post-install runs independently of the app itself.

**Engine and architecture:** Hermes, New Architecture (Fabric) enabled. These numbers shouldn't be compared against a legacy-bridge measurement — runtime characteristics differ enough that the comparison wouldn't be meaningful.

**Instrumentation:** `Date.now()` markers around three phases — JSON fetch, zod `safeParse`, and the view-build (data-available to render-committed) — read via `adb logcat`. This was chosen over the Hermes Sampling Profiler or Perfetto trace markers specifically because the assignment's breakdown ask (fetch vs. parse vs. view-build) is three phase-boundaries inside a single JS execution context, which direct timestamp comparison answers exactly, with no sampling/flame-graph interpretation needed. A Perfetto-integrated version of this same measurement, with custom trace markers visible alongside native frame data, would be the next step for CI-integrated, ongoing monitoring rather than a one-time benchmark. These three markers are JS-thread measurements. Scroll performance is a separate, UI-thread/GPU measurement via `adb shell dumpsys gfxinfo <package>`, reset before each scroll session — the two measurement types aren't directly comparable to each other and aren't presented as such.

## Results

| Metric | Definition | Static | SDUI |
|---|---|---|---|
| TTR / Full page time / TTI | Cold open → rendered, scrollable, tappable | 202.7ms | 416.3ms |
| Fetch | JSON retrieval | — | 316ms |
| Parse | zod `safeParse` | — | 22.7ms |
| View-build | Data available → render committed | 202.7ms | 77.7ms |
| Scroll — janky frames | % of frames over 16.6ms during sustained scroll | 0.00% (0/1282) | 0.10% (1/998) |
| Scroll — 50th / 90th / 95th / 99th percentile | Frame time at each percentile | 7 / 10 / 11 / 14ms | 10 / 14 / 15 / 15ms |

Fetch, parse, and view-build are rounded to one decimal; totals use unrounded values, so they may differ from the rounded sum by up to 0.1ms. Across the six runs, SDUI's total ranged 391–482ms and static's ranged 176–223ms — both tight relative to their means, no run more than 16% off average.

TTR, TTI, and full-page time collapse to a single number here because this system renders synchronously in one pass — there is no incremental or above-the-fold-first render stage separate from the full page, so cold-open-to-rendered and cold-open-to-interactive land at the same point. Interactivity was confirmed by scrolling immediately on cold open across multiple runs; no perceptible delay between render and responsiveness was observed.

## Overhead

**Observation:** SDUI is ~105% slower than static in raw totals (416.3ms vs. 202.7ms).

**Reason:** the gap is dominated by fetch (316ms), which includes an intentionally injected 300ms delay simulating network latency against the local mock JSON — not a cost intrinsic to SDUI. The measured fetch time should not be interpreted as SDUI overhead for this reason.

**Evidence:** excluding fetch, SDUI's own mechanism — parse plus view-build — costs 100.4ms, faster than static's view-build alone (202.7ms).

**Limitation:** that comparison isn't fully apples-to-apples. SDUI does more work per section than static (a registry lookup, prop-spreading, and an error boundary per node, versus directly-written JSX), so a faster result is counter-intuitive on its face. One plausible explanation is that the SDUI timer measures a re-render after data arrives, while the static timer measures the initial mount — different points in the render lifecycle, making the two measurements non-equivalent. This is reported as an observation, not attributed to a verified cause.

## What was tried

| Step | What happened |
|---|---|
| Hypothesis | The renderer validated each section twice per node — a loose "shell" check to detect whether a type was recognized, then a full schema check for recognized types. Removing the redundant first pass should measurably reduce parse time. |
| Action | Removed the shell-check pass; re-benchmarked on a debug build. |
| Result | Parse time unchanged — 770–1066ms across 17 runs, both before and after the change. |
| Root cause found | A separate investigation (comparing debug and release builds for an unrelated reason) showed the same single-pass code at 19–22ms on release — the debug/release gap accounted for the number, not the validation architecture. The double-pass version was never re-tested on release; there was no basis to expect a different outcome from it once the debug-build comparison had already shown no difference, only an untested assumption. |
| Outcome | The single-pass change was kept — it removes redundant work and simplifies the unknown-vs-malformed distinction in the renderer — but it's a code-quality cleanup, not a performance fix, and isn't credited as one. |

No further optimization was pursued once the release-build numbers were in: at ~100ms of SDUI-specific overhead against a 202.7ms baseline, with near-zero scroll jank on both screens, there was little left to gain from further tuning here. That time went instead to schema coverage and generalization testing, which was still incomplete at this point — see `COVERAGE.md`.