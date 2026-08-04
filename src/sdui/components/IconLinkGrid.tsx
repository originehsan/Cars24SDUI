import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Item {
  id: string;
  label: string;
  iconUrl?: string;
  subtitle?: string;
}

interface Props {
  title?: string;
  columns?: number;
  items: Item[];
}

export function IconLinkGrid({ title, columns = 3, items }: Props) {
  const itemWidth = `${100 / columns}%`;

  return (
    <View style={styles.container}>
      {title ? (
        <Text variant="h3" style={styles.title}>
          {title}
        </Text>
      ) : null}

      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.id} style={[styles.itemWrapper, { width: itemWidth as any }]}>
            <Pressable style={styles.item}>
              {item.iconUrl ? (
                <Image source={{ uri: item.iconUrl }} style={styles.icon} />
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
              <Text variant="caption" style={styles.label} numberOfLines={2}>
                {item.label}
              </Text>
              {item.subtitle ? (
                <Text variant="caption" color="textMuted" numberOfLines={1}>
                  {item.subtitle}
                </Text>
              ) : null}
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  title: { marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  itemWrapper: { padding: spacing.xs },
  item: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  icon: { width: 36, height: 36, marginBottom: spacing.xs },
  iconPlaceholder: {
    width: 36,
    height: 36,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  label: { textAlign: 'center' },
});