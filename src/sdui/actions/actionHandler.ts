import type { Action } from '@sdui/schema/types';

/**
 * Whitelist of screen names the app actually knows how to navigate to.
 * A "navigate" action's target is checked against this before anything
 * happens — never navigate to an arbitrary server-provided string.
 * Update this list when navigation/ screens are added.
 */
const ALLOWED_SCREENS = ['home', 'car_detail'] as const;

/** Set once navigation/ is built — kept as an injectable dependency so
 * actionHandler has zero direct coupling to a specific nav library. */
let navigateFn: ((screenName: string, params?: Record<string, unknown>) => void) | null = null;

export function registerNavigator(fn: typeof navigateFn) {
  navigateFn = fn;
}

function handleNavigate(action: Action) {
  const target = action.target;
  if (!target || !ALLOWED_SCREENS.includes(target as (typeof ALLOWED_SCREENS)[number])) {
    console.warn(`[SDUI] Blocked navigate to unlisted screen: "${target}"`);
    return;
  }
  if (!navigateFn) {
    console.warn('[SDUI] Navigate requested but no navigator registered yet:', target);
    return;
  }
  navigateFn(target, action.params);
}

function handleTrack(action: Action) {
  // Placeholder for a real analytics SDK (Sentry/Firebase/etc).
  console.log('[SDUI][track]', action.target, action.params);
}

function handleOpenUrl(action: Action) {
  console.log('[SDUI][open_url]', action.target);
  // Linking.openURL would go here — omitted until a real use case needs it.
}

function handleUpdateState(action: Action) {
  console.log('[SDUI][update_state]', action.target, action.params);
  // Reserved for future Zustand-store-driven state updates.
}

/** Runs a list of actions in order — this is what supports chaining
 * (e.g. [track, navigate] firing from a single tap). */
export function runActions(actions: Action[] | undefined) {
  if (!actions) return;
  for (const action of actions) {
    switch (action.type) {
      case 'navigate':
        handleNavigate(action);
        break;
      case 'track':
        handleTrack(action);
        break;
      case 'open_url':
        handleOpenUrl(action);
        break;
      case 'update_state':
        handleUpdateState(action);
        break;
     default:
        console.warn('[SDUI] Unknown action type:', action.type satisfies never);
    }
  }
}