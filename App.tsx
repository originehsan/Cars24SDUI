/**
 * App entry — wraps the SDUI render with the providers it needs:
 * SafeAreaProvider (notch/status-bar), QueryClientProvider (data
 * fetching/cache), a root-level ErrorBoundary (crash safety net),
 * and RootNavigator (real navigation between SDUI screens).
 *
 * @format
 */

import { StatusBar, useColorScheme, View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { RootNavigator } from '@navigation/RootNavigator';

// One QueryClient for the app's whole lifetime — created outside the
// component so it isn't recreated (and cache lost) on every re-render.
const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary FallbackComponent={AppCrashFallback}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Last-resort UI if something crashes above SDUIScreen's own boundaries.
function AppCrashFallback() {
  return (
    <View style={styles.centered}>
      <Text>Something went wrong.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default App;