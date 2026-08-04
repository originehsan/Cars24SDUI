import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SDUIScreen } from '@sdui/registry/renderer';
import { useSduiScreen } from '@core/hooks/useSduiScreen';
import { useEffect } from 'react';
import { markStart, markEnd } from '@core/utils/perfTimer';

export function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data, isLoading, error } = useSduiScreen('home');

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
      {/* TEMPORARY — access point for the perf-benchmark twin screen.
          Remove once benchmarking is done, or keep if useful for demo. */}
      <Pressable
        style={styles.benchmarkButton}
        onPress={() => navigation.navigate('static_home' as never)}
      >
        <Text style={styles.benchmarkText}>⚡ View Static Benchmark</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  benchmarkButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  benchmarkText: { color: '#FFFFFF', fontSize: 12 },
});