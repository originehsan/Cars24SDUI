/**
 * App entry — wraps the SDUI render with the providers it needs:
 * SafeAreaProvider (notch/status-bar), QueryClientProvider (data
 * fetching/cache), and a root-level ErrorBoundary (crash safety net).
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { SDUIScreen } from '@sdui/registry/renderer';
import { useSduiScreen } from '@core/hooks/useSduiScreen';

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
          <AppContent />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  // Temporary: renders "home" directly, no navigation screen wrapper yet.
  const { data, isLoading, error } = useSduiScreen('home');

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Failed to load screen: {(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <SDUIScreen raw={data} />
    </View>
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
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default App;