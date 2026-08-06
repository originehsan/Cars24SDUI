import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Item {
  id: string;
  iconUrl?: string;
  title: string;
  description?: string;
}

interface Props {
  title?: string;
  items: Item[];
  accentColor?: 'orange' | 'purple';
}

export function FeatureList({ title, items, accentColor }: Props) {
  const borderColor =
    accentColor === 'orange' ? colors.accent : accentColor === 'purple' ? colors.accentSecondary : colors.border;
  const iconCircleColor =
    accentColor === 'orange' ? colors.accent : accentColor === 'purple' ? colors.accentSecondary : colors.textMuted;

  return (
    <View style={[styles.container, { borderColor }]}>
      {title ? (
        <Text variant="h3" style={styles.header}>
          {title}
        </Text>
      ) : null}
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          {item.iconUrl ? (
            <View style={[styles.iconCircle, { backgroundColor: iconCircleColor }]}>
              <MaterialDesignIcons name={item.iconUrl as any} size={20} color={colors.textOnPrimary} />
            </View>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
          <View style={styles.textCol}>
            <Text variant="h3">{item.title}</Text>
            {item.description ? (
              <Text variant="caption" color="textSecondary" style={styles.description}>
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    margin: spacing.md,
  },
  header: { marginBottom: spacing.md },
  row: { flexDirection: 'row', marginBottom: spacing.lg, alignItems: 'flex-start' },
  iconCircle: {
    width: 40,
    height: 40,
    marginRight: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    marginRight: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  textCol: { flex: 1 },
  description: { marginTop: 2 },
});