import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FallbackProps {
  componentType: string;
  componentId: string;
}

/**
 * Rendered when the registry doesn't recognize a component type.
 * This is the graceful-degradation requirement — the screen must
 * never crash on an unknown type, and this event should be logged
 * (analytics hook goes here once core/hooks/useAnalytics exists).
 */
export function UnknownComponentFallback({ componentType, componentId }: FallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Unsupported component: {componentType}</Text>
      <Text style={styles.idText}>id: {componentId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  text: { fontSize: 13, color: '#E65100' },
  idText: { fontSize: 11, color: '#999', marginTop: 4 },
});