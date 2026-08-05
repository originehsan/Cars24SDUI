import React from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { resolveImageSource } from '@core/constants/localImages';
interface Card {
  id: string;
  title: string;
  imageUrl: string;
}

interface Props {
  title: string;
  badgeText?: string;
  cards: Card[];
}

export function CardRail({ title, badgeText, cards }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3">{title}</Text>
        {badgeText ? (
          <View style={styles.badge}>
            <Text variant="caption" color="error">
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cards.map((card) => (
          <Pressable key={card.id} style={styles.card}>
            <Image source={resolveImageSource(card.imageUrl)} style={styles.image} resizeMode="cover" />
            <Text variant="label" style={styles.cardTitle}>
              {card.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: '#FDECEC',
  },
  card: {
    width: 140,
    marginRight: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  image: { width: '100%', height: 80 },
  cardTitle: {
    padding: spacing.sm,
    color: colors.textOnPrimary,
  },
});