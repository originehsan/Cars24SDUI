import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { runActions } from '@sdui/actions/actionHandler';

interface Item {
  id: string;
  eyebrow?: string;
  label: string;
  actions?: { type: string; target?: string; params?: Record<string, unknown> }[];
}

interface Props {
  title?: string;
  items: Item[];
}

export function LinkList({ title, items }: Props) {
  return (
    <View style={styles.container}>
      {title ? (
        <Text variant="h3" style={styles.header}>
          {title}
        </Text>
      ) : null}

      {items.map((item) => (
        <Pressable key={item.id} style={styles.row} onPress={() => runActions(item.actions as any)}>
          <View style={styles.textCol}>
            {item.eyebrow ? (
              <Text variant="caption" color="textMuted">
                {item.eyebrow}
              </Text>
            ) : null}
            <Text variant="body">{item.label}</Text>
          </View>
          <Text variant="h3" color="textMuted">
            ›
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  header: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  textCol: { flex: 1 },
});