import { useQuery } from '@tanstack/react-query';
import { fetchScreen } from '@core/api/sduiService';

/**
 * Fetches + caches a named SDUI screen. Component layer only calls this —
 * never fetchScreen() directly (keeps the fetch/cache concern in one place).
 */
export function useSduiScreen(screenName: string) {
  return useQuery({
    queryKey: ['sdui-screen', screenName],
    queryFn: () => fetchScreen(screenName),
  });
}