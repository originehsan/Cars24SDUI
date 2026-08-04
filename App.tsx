/**
 * App entry — wraps the SDUI render with the providers it needs:
 * SafeAreaProvider (notch/status-bar), QueryClientProvider (data
 * fetching/cache), and a root-level ErrorBoundary (crash safety net).
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator, Text, Pressable } from 'react-native';
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
  // TEMPORARY test scaffolding — no real navigation yet. Toggle between
  // mock screens here to verify each renders correctly. Remove once
  // navigation/ is built.
  const [screenName, setScreenName] = useState<'home' | 'car_detail'>('home');
  const { data, isLoading, error } = useSduiScreen(screenName);

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
      <View style={styles.devToggle}>
        <Pressable onPress={() => setScreenName('home')}>
          <Text>Home</Text>
        </Pressable>
        <Pressable onPress={() => setScreenName('car_detail')}>
          <Text>Car Detail</Text>
        </Pressable>
      </View>
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
  devToggle: { flexDirection: 'row', justifyContent: 'space-around', padding: 8, backgroundColor: '#eee' },
});

export default App;