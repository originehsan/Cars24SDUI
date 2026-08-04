import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SDUIScreen } from '@sdui/registry/renderer';
import { useSduiScreen } from '@core/hooks/useSduiScreen';

export function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});