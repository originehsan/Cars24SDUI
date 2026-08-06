import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { colors, spacing, radius } from '@core/theme/tokens';

interface FallbackProps {
  componentType: string;
  componentId: string;
}

/**
 * Rendered when the registry doesn't recognize a component type.
 * This is the graceful-degradation requirement — the screen must
 * never crash on an unknown type, and this event should be logged
 * (analytics hook goes here once core/hooks/useAnalytics exists).
 *
 * Deliberately styled to be clearly recognizable as a fallback state,
 * not disguised as real content — while still looking intentional
 * rather than an unstyled error dump.
 */
export function UnknownComponentFallback({ componentType, componentId }: FallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialDesignIcons name="alert-circle" size={20} color={colors.warning} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Unsupported component</Text>
        <Text style={styles.text}>
          type: <Text style={styles.mono}>{componentType}</Text>
        </Text>
        <Text style={styles.idText}>id: {componentId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    margin: spacing.md,
    backgroundColor: '#FFF8E8',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: '#FFF3D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textBlock: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  text: { fontSize: 13, color: colors.textSecondary },
  mono: { fontFamily: 'monospace', color: colors.textPrimary },
  idText: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});