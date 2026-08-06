import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { SDUIScreen } from '@sdui/registry/renderer';
import { useSduiScreen } from '@core/hooks/useSduiScreen';
import { markStart, markEnd } from '@core/utils/perfTimer';
import { colors, spacing } from '@core/theme/tokens';

export function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { data, isLoading, error } = useSduiScreen('home');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(colors.primary);
    }, []),
  );

  // Marks the moment data becomes available to the moment this component
  // has fully rendered (view-build time) — the third leg of the SDUI
  // fetch/parse/build breakdown for PERF.md.
  useEffect(() => {
    if (data) {
      const buildStart = markStart('view-build:home');
      // requestAnimationFrame fires after the current render commits.
      requestAnimationFrame(() => markEnd('view-build:home', buildStart));
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load screen</Text>
        <Text style={styles.errorDetail}>{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <SDUIScreen raw={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  errorDetail: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.lg },
});