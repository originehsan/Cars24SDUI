/**
 * Minimal perf-marker utility for the SDUI-vs-static benchmark (see
 * PERF.md). Uses Date.now() rather than performance.now() — RN's
 * TypeScript config doesn't include the "dom" lib, and millisecond
 * precision is plenty for the differences this benchmark measures.
 * Logs to console — numbers are manually recorded from a release-build
 * device run, not collected automatically in-app.
 */
export function markStart(label: string) {
  const t = Date.now();
  console.log(`[PERF] ${label} — start: ${t}`);
  return t;
}

export function markEnd(label: string, startTime: number) {
  const t = Date.now();
  console.log(`[PERF] ${label} — end: ${t} (took ${t - startTime}ms)`);
  return t;
}