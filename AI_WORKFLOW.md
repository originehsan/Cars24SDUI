# AI_WORKFLOW.md

## Tool stack

Claude (conversational assistant) for architecture design, schema design, component implementation, debugging guidance, and documentation. An IDE-integrated coding agent (Antigravity, VS Code-based) for autonomous diagnosis and fixing of native Android build failures directly on the local machine — invoked with structured prompts rather than open-ended requests.

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

### 3. Auditing AI-generated documentation against source data

**Prompt:** after each of `README.md`, `PERF.md`, and `COVERAGE.md` was drafted, a follow-up prompt explicitly requested a critical audit pass — reading the draft fresh, cross-checking every number against the actual source files rather than against what had been discussed earlier in the conversation.

**Outcome:** each pass found and corrected genuine errors that had made it into a first draft. `README.md`'s first version stated an unverified count of section instances; recounting directly from `home.json` and `car_detail.json` produced a different, lower number. `COVERAGE.md`'s first version claimed `text_block` was reused in `car_detail.json` — untrue; that file contains no `text_block` section at all. `PERF.md`'s first version reported that SDUI's rendering was faster than the static screen's without comment, despite SDUI doing more work per section — a counter-intuitive result left unexplained.

**What was rejected/rewritten and why:** all three drafts were rejected as-written and corrected before being finalized. The section count was replaced with the recounted figure. The false `text_block` claim was replaced with the actual reuse pattern (a different component, reused within the same file). The unexplained performance number was not deleted or hidden — it was kept, with a caveat added stating the likely cause as an unverified hypothesis rather than presenting an unexplained result as if it needed no scrutiny.

**What this represents:** treating a document as a first draft by default, not as finished output — the audit prompt was applied uniformly to every generated document in this repository, and none were accepted without it.

## One AI failure

**Context:** a debug-build measurement showed `zod`'s `safeParse` taking roughly 800ms to validate a small screen-shell schema — disproportionate for what the schema actually checks.

**The failure:** Claude's diagnosis, within this same working session, was that the renderer's two-stage validation — a lightweight shell check for every section, followed by a full schema check for recognized types — was running redundant work, and that removing the first pass would measurably reduce parse time. This was a plausible-sounding hypothesis that was never actually profiled before being acted on.

**Action taken and result:** the single-pass validation change was implemented and re-benchmarked. Parse time was unchanged — consistent in the 770–1066ms range across 17 debug-build runs both before and after the change. The hypothesis was wrong: the removed shell check was never the expensive part.

**How it was caught:** a subsequent, unrelated investigation (comparing debug and release builds for a different reason) showed the same code measured on a release build at 19–22ms — a roughly 40× difference that had nothing to do with the validation architecture. The actual cause was debug-mode JS overhead, present regardless of which validation approach was used.

**Outcome:** the single-pass change was kept in the codebase, since it's a legitimate simplification independent of performance, but `PERF.md` explicitly does not credit it as a fix — crediting an untested cause would have repeated the same mistake in the documentation.

## Verification strategy

- `npx tsc --noEmit` run after every code change, before treating it as done — not just after a batch of changes.
- Every feature verified on a physical device — visual confirmation plus `adb logcat` for anything with a side effect (actions firing, the unknown-component fallback rendering, the tenure slider's tracking event) — rather than trusting that code which type-checks also behaves correctly at runtime.
- Native/build fixes regression-tested against the previously-working configuration, not just checked for whether the new path succeeds.
- Numbers in generated documentation re-derived from the actual current source files (JSON payloads, schema, component registry) at write time, not reused from earlier estimates made mid-conversation.
- AI-suggested APIs or configuration options not added to the codebase without confirming they exist in the actual installed package — an unverified suggestion is a lead to check, not something to paste in.
- Technical questions with genuine uncertainty (the zod/Hermes investigation) cross-checked across multiple independent sources rather than accepted from a single answer, with disagreements between sources treated as a reason to verify independently rather than a reason to pick whichever answer sounded most confident.
- Every generated document audited in a dedicated pass against source data before being treated as final, per the three examples above.