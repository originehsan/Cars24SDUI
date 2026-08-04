import { USE_MOCK_SERVER, MOCK_SERVER_DELAY_MS } from '@core/constants/config';
import { ScreenShellSchema } from '@sdui/schema/types';
import homeJson from '@sdui/mock-server/home.json';

import carDetailJson from '@sdui/mock-server/car_detail.json';

const MOCK_SCREENS: Record<string, unknown> = {
  home: homeJson,
  car_detail: carDetailJson,
};

/**
 * Fetches a screen's raw SDUI payload. Only the top-level shell is
 * validated here (fail fast if the JSON itself is broken) — per-section
 * validation happens later in the renderer, so one bad section doesn't
 * fail the whole fetch. Swapping USE_MOCK_SERVER for a real endpoint
 * only touches this file, nothing upstream.
 */
export async function fetchScreen(screenName: string): Promise<unknown> {
  if (!USE_MOCK_SERVER) {
    throw new Error('[SDUI] Real API not implemented yet — set USE_MOCK_SERVER to true');
  }

  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_SERVER_DELAY_MS));

  const data = MOCK_SCREENS[screenName];
  if (!data) {
    throw new Error(`[SDUI] No mock data found for screen "${screenName}"`);
  }

  const shell = ScreenShellSchema.safeParse(data);
  if (!shell.success) {
    throw new Error(`[SDUI] Screen "${screenName}" failed shell validation`);
  }

  return data;
}