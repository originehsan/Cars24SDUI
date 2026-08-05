# AI_WORKFLOW.md

**At a glance:** Claude used for implementation and analysis under direction — architectural calls (flat vs. recursive schema, state-management split, action-as-array for chaining) were specified before code was generated, not left to the model to decide. An IDE-integrated agent used separately for autonomous native-build fixes, under explicit constraints. Three prompt→outcome stories below: a build-fix agent's output diffed and regression-tested before being trusted; three independent AI sources gave conflicting performance theories, none acted on without independent verification; a weak verification test was rejected and replaced with a harder one. One AI failure: a plausible-sounding optimization hypothesis was implemented, measured, and found wrong. Verification strategy at the bottom.

## Tool stack

Before implementation, I decided the schema shape, the state-management split, and the action model — a flat schema over a recursive one, Zustand for local UI state against TanStack Query for server state, action arrays instead of single actions to support chaining. Claude was used after each such decision — to implement it, to lay out trade-offs between options that had already been narrowed down, and to challenge a decision when asked to stress-test it. Its output was corrected or rewritten where it didn't hold up under testing (see below). An IDE-integrated coding agent (Antigravity, VS Code-based) was used separately for autonomous diagnosis and fixing of native Android build failures directly on the local machine — invoked with explicit constraints rather than open-ended requests.

**Context file:** `AGENTS.md`, in the project root. It documents the stack conventions (state management split, styling approach, functional-components-only rule and its one library-level exception), the file structure and where business logic belongs, SDUI-specific non-negotiables (never crash on an unknown type, validate before rendering, one file per new component type), known environment gotchas (NDK version and why, native-module patches managed via `patch-package`), and a verification checklist. It was updated throughout the build as new gotchas were found, not written once and left static.

## Prompt → outcome

### 1. Delegating a native build failure to the IDE agent

**Prompt (paraphrased; full version instructed the agent to read `AGENTS.md` first):** capture the actual Gradle error to a log file and grep it rather than guess; diagnose from the real error text; fix it; do not change the pinned NDK version further, do not run `npm audit fix --force`, do not add native dependencies unless the error explicitly required one, do not touch application source files unless the error clearly originated there; update `AGENTS.md` with whatever was found; summarize what changed and why.

**Outcome:** the agent identified a stale, corrupted Ninja build-cache state from a previously interrupted build (not the error initially assumed), cleared it, and — in a related follow-up run — independently diagnosed and fixed a genuine NDK-27 Windows linking bug using an explicit `-lc++_shared` linker flag, migrating off an NDK-26 pin that had been manually chosen earlier in the project for a different, now-superseded reason. It also set up `patch-package` so several native-module patches persist across `npm install`, instead of needing to be manually reapplied.

**What was rejected/verified before accepting:** the agent's diff included a stray block of temporary diagnostic code (a `console.log`-based timing probe added earlier in an unrelated investigation) sitting in a file it had touched — this was caught on review and removed before committing. Separately, the agent's own claim that "the project had already migrated to NDK 27" was not taken at face value; a full regression build and on-device relaunch was run specifically to confirm the previously-working debug configuration still worked, before trusting the change.

### 2. Cross-checking an unexplained performance number across independent sources

**Prompt:** a detailed technical question, given in parallel to three separate AI systems, describing an exact, reproducible symptom (a specific zod schema taking roughly 800ms to validate a small payload on Hermes, versus near-zero for a structurally similar trivial schema in the same process) and explicitly listing hypotheses already tested and ruled out, to avoid repeated suggestions.

**Outcome:** the three responses partially disagreed with each other — two proposed that Hermes doesn't support the JIT-compilation path zod v4 relies on internally, while all three converged on a related theory that a schema used only once per process — inherent to a cold-start benchmark, where every run is a fresh process — pays a compilation cost that never gets amortized. More than one suggested an unverified zod configuration flag (`jit: false` or similar) to disable the behavior.

**What was rejected:** none of the three hypotheses were acted on directly, and the suggested configuration flag was specifically not added to the codebase, since its existence in the installed zod version's type definitions was never confirmed. Instead, the actual variable that mattered — debug versus release build — was isolated through a controlled before/after measurement, which resolved the question independently of any of the three answers (see the AI failure below for the related finding).

### 3. Escalating a weak verification test into a rigorous one

**Prompt:** an initial live-edit demo used a single string-field change (a placeholder label) to show the JSON-to-render pipeline working. This was recognized as insufficient evidence — a trivial text change proves almost nothing about the system's resilience claims, since any templating approach could do the same. The follow-up prompt specified three deliberately hard, concrete test cases instead: a section using a recognized component type with invalid prop types (wrong data shape, not just wrong values), a section using a genuinely unregistered component type with also-malformed internal structure, and a rail with a larger-than-typical item count.

**Outcome:** each case was added to the mock JSON and verified independently, not just visually. The malformed-but-recognized-type section rendered nothing and did not crash the rest of the screen; `adb logcat` grepped for the renderer's drop-warning confirmed it had been caught and logged by schema validation, not silently ignored by accident. The unregistered-and-malformed section rendered the fallback component. The larger rail rendered and scrolled normally. All three were then removed from the mock data before committing, so the shipped JSON stays a clean, realistic example rather than a permanent test fixture.

**What was rejected and why:** the original single-field edit was rejected as a demo of "the system works" — it demonstrated only that a string can change, not that the schema-validation, fallback, or drop-and-continue behavior the assignment specifically asks for actually holds under bad input. The harder test was designed specifically to fail informatively — a case built to expose broken behavior, not to succeed cheaply.

## One AI failure

| Step | What happened |
|---|---|
| Context | A debug-build measurement showed `zod`'s `safeParse` taking roughly 800ms to validate a small screen-shell schema — disproportionate for what the schema actually checks. |
| Hypothesis (proposed by Claude) | The renderer's two-stage validation — a lightweight shell check for every section, then a full schema check for recognized types — was doing redundant work; removing the shell-check pass should measurably reduce parse time. Never profiled before being acted on. |
| Action and result | The single-pass validation change was implemented and re-benchmarked. Parse time was unchanged — 770–1066ms across 17 debug-build runs, both before and after. The hypothesis was wrong. |
| How it was caught | A subsequent, unrelated investigation (comparing debug and release builds for a different reason) showed the same code at 19–22ms on release — a roughly 40× difference that had nothing to do with the validation architecture. |
| Outcome | The single-pass change was kept as a legitimate simplification, but `PERF.md` does not credit it as a performance fix — crediting an untested cause would have repeated the same mistake in the documentation. |

## Verification strategy

Verification happened before trusting AI output enough to build further on it — not after a feature was already considered finished.

- `npx tsc --noEmit` run after every code change, before treating it as done — not just after a batch of changes.
- Every feature verified on a physical device — visual confirmation plus `adb logcat` for anything with a side effect (actions firing, the unknown-component fallback rendering, the tenure slider's tracking event) — rather than trusting that code which type-checks also behaves correctly at runtime.
- Native/build fixes regression-tested against the previously-working configuration, not just checked for whether the new path succeeds.
- AI-suggested APIs or configuration options not added to the codebase without confirming they exist in the actual installed package — an unverified suggestion is a lead to check, not something to paste in.
- Technical questions with genuine uncertainty (the zod/Hermes investigation) compared across multiple independent AI systems rather than accepted from a single answer, with disagreements between them treated as a reason to verify independently rather than a reason to pick whichever answer sounded most confident.