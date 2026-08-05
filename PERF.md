# PERF.md

## Device and methodology

**Device:** Redmi Note 8 Pro, Android 10 (API 30) — mid-range hardware, comparable to the assignment's suggested reference class.

**Build:** Release APK (`assembleRelease`), not debug. This matters: an identical measurement on a debug build showed `parse` time at roughly 800ms versus 19ms on release — nearly 40× higher — because debug builds run unminified, with `__DEV__`-gated checks active and no bundle optimization. Every number in this document is from a release build; debug-build numbers are not representative and are not used for reporting here.

**Sampling:** Six cold-start runs per screen (fresh process each run — force-stopped and relaunched, not a warm reload). Where a session produced more than six readings, only the first six in original sequence were kept — none were selected for their value. A 90-second wait was observed after each APK install before the first measurement, since Android's background dexopt/verification step following an install otherwise inflates the first few post-install runs independently of the app itself.

**Engine and architecture:** Hermes, New Architecture (Fabric) enabled. Worth noting up front: Fabric's JSI-based JS-to-native handoff removes the old bridge's serialization step, which is a documented contributor to New Architecture's generally lower render times industry-wide — relevant context for why the absolute view-build numbers below are small, though it doesn't by itself explain the relative difference between the two screens' numbers (addressed separately, in the Overhead section).

**Instrumentation:** `Date.now()` markers around three phases — JSON fetch, zod `safeParse`, and the view-build (data-available to render-committed) — read via `adb logcat`. These three are JS-thread measurements. Scroll performance is a separate, UI-thread/GPU measurement via `adb shell dumpsys gfxinfo <package>`, reset before each scroll session — the two measurement types aren't directly comparable to each other and aren't presented as such.

## Results

| Metric | Definition | Static | SDUI |
|---|---|---|---|
| TTR / Full page time / TTI | Cold open → rendered, scrollable, tappable | 202.7ms | 416.3ms |
| Fetch | JSON retrieval | — | 316ms |
| Parse | zod `safeParse` | — | 22.7ms |
| View-build | Data available → render committed | 202.7ms | 77.7ms |
| Scroll — janky frames | % of frames over 16.6ms during sustained scroll | 0.00% (0/1282) | 0.10% (1/998) |
| Scroll — 50th / 90th / 95th / 99th percentile | Frame time at each percentile | 7 / 10 / 11 / 14ms | 10 / 14 / 15 / 15ms |

Fetch, parse, and view-build are each rounded to one decimal place; the total is computed from unrounded per-run values, so it may differ from the sum of the rounded rows by up to 0.1ms.

Across the six runs, SDUI's total ranged 391–482ms and static's ranged 176–223ms — both bands are tight relative to their means, with no run more than 16% off the average in either direction.

TTR, TTI, and full-page time collapse to a single number here because this system renders synchronously in one pass — there is no incremental or above-the-fold-first render stage separate from the full page, so cold-open-to-rendered and cold-open-to-interactive land at the same point. Interactivity was confirmed by scrolling immediately on cold open across multiple runs; no perceptible delay between render and responsiveness was observed. Both totals are well within the 2-second cold-start reference commonly used for mid-tier Android devices.

**Overhead: SDUI is ~105% slower than static (416.3ms vs 202.7ms).**

That number needs the fetch figure separated out to be meaningful. Fetch (316ms) is dominated by an artificial 300ms delay this project injects to simulate network latency against the local mock JSON — it is not a cost inherent to SDUI, and a real backend would produce a different number entirely, likely lower with caching or a CDN in front of it. Excluding it, SDUI's own mechanism — parse plus view-build — costs **100.4ms**, which is *faster* than the static screen's view-build alone (202.7ms).

That comparison is worth flagging rather than taking at face value: SDUI does strictly more work per section than static (a registry lookup, prop-spreading, and an error boundary per node, versus directly-written JSX), so a faster result is counter-intuitive on its face. The most likely explanation is that the two numbers capture different moments in the component lifecycle rather than the same kind of work — static's timer spans a screen's first mount (building a tree from nothing), while SDUI's spans a state transition within an already-mounted screen (loading state to content state, once the fetched data arrives), and a re-render is often cheaper than an initial mount for a comparable tree size. This wasn't independently profiled to confirm, and shouldn't be read as evidence that the SDUI rendering path is inherently faster — it's reported as observed, with the likely cause of the asymmetry noted as a hypothesis, not a verified fact.

## What was tried

The renderer originally validated each section twice per node — a loose "shell" check to detect whether a component type was recognized, followed by a full schema validation for known types. The hypothesis was that removing the redundant first pass would measurably reduce parse time. It was removed and re-benchmarked on a debug build: parse time was unchanged, holding in the 770–1066ms range across 17 runs both before and after the change. The debug/release gap, identified afterward, explains why the number was that high in the first place — parse time on a release build, measured only for the single-pass version, is 19–22ms per run. The double-pass version was not separately re-tested on release; the debug-build comparison had already shown the validation change made no measurable difference, so there was no basis to expect a different release-build outcome from it, only an untested assumption. The single-pass validation change was kept regardless — it removes redundant work and simplifies the unknown-vs-malformed distinction in the renderer — but should be read as a code-quality cleanup, not the fix for a performance problem it didn't cause.

No further optimization was pursued once the release-build numbers were in: at ~100ms of SDUI-specific overhead against a 202.7ms baseline, with both screens well under the assignment's 2-second cold-start reference and showing near-zero scroll jank, there was no remaining bottleneck to chase within this system's current scope.