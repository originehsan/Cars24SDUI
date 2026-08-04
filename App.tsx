/**
 * App entry — wraps the SDUI render with the providers it needs:
 * GestureHandlerRootView (required for gesture-handler + bottom-sheet),
 * SafeAreaProvider (notch/status-bar), QueryClientProvider (data
 * fetching/cache), BottomSheetModalProvider (sheets render above
 * navigation), a root-level ErrorBoundary (crash safety net), and
 * RootNavigator (real navigation between SDUI screens).
 *
 * @format
 */

import { StatusBar, useColorScheme, View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ErrorBoundary } from 'react-error-boundary';
import { RootNavigator } from '@navigation/RootNavigator';
import { EligibilityBottomSheet } from '@navigation/EligibilityBottomSheet';

// One QueryClient for the app's whole lifetime — created outside the
// component so it isn't recreated (and cache lost) on every re-render.
const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary FallbackComponent={AppCrashFallback}>
      <GestureHandlerRootView style={styles.flex}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <RootNavigator />
              <EligibilityBottomSheet />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
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
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default App;