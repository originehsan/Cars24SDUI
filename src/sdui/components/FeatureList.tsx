import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
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
}

export function FeatureList({ title, items }: Props) {
  return (
    <View style={styles.container}>
      {title ? (
        <Text variant="h3" style={styles.header}>
          {title}
        </Text>
      ) : null}

      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          {item.iconUrl ? (
            <Image source={{ uri: item.iconUrl }} style={styles.icon} />
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
  container: { padding: spacing.lg },
  header: { marginBottom: spacing.md },
  row: { flexDirection: 'row', marginBottom: spacing.lg, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, marginRight: spacing.md, borderRadius: radius.pill },
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