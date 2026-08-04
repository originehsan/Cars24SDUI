import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from '@core/ui';
import { spacing } from '@core/theme/tokens';

interface SpecItem {
  label: string;
  value: string;
}

interface Props {
  title?: string;
  columns?: number;
  items: SpecItem[];
}

export function SpecGrid({ title, columns = 3, items }: Props) {
  const itemWidth = `${100 / columns}%`;

  return (
    <Card style={styles.container}>
      {title ? (
        <Text variant="h3" style={styles.header}>
          {title}
        </Text>
      ) : null}

      <View style={styles.grid}>
        {items.map((item, i) => (
          <View key={i} style={[styles.cell, { width: itemWidth as any }]}>
            <Text variant="caption" color="textMuted">
              {item.label}
            </Text>
            <Text variant="h3" style={styles.value}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { margin: spacing.md },
  header: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { marginBottom: spacing.lg, paddingRight: spacing.sm },
  value: { marginTop: 2 },
});