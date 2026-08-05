import React, { useState } from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { runActions } from '@sdui/actions/actionHandler';
import { resolveImageSource } from '@core/constants/localImages';
import { resolveBadgeColors } from '@core/theme/badgeColors';
interface Tab {
  id: string;
  label: string;
}

interface CarCard {
  id: string;
  title: string;
  variant?: string;
  imageUrl: string;
  price: string;
  emi?: string;
  km?: string;
  fuel?: string;
  transmission?: string;
  badge?: string;
  actions?: { type: string; target?: string; params?: Record<string, unknown> }[];
}

interface Props {
  title: string;
  tabs?: Tab[];
  selectedTabId?: string;
  cars: CarCard[];
}

export function CarListingRail({ title, tabs, selectedTabId, cars }: Props) {
  const [activeTab, setActiveTab] = useState(selectedTabId ?? tabs?.[0]?.id);

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>

      {tabs ? (
        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text variant="label" color={isActive ? 'primary' : 'textSecondary'}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cars.map((car) => (
          <Pressable key={car.id} style={styles.card} onPress={() => runActions(car.actions as any)}>
            <View>
              <Image source={resolveImageSource(car.imageUrl)} style={styles.image} resizeMode="cover" />
              {car.badge ? (
                <View style={[styles.badge, { backgroundColor: resolveBadgeColors(car.badge).background }]}>
                  <Text variant="caption" style={{ color: resolveBadgeColors(car.badge).text }}>
                    {car.badge}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.details}>
              <Text variant="h3" numberOfLines={1}>
                {car.title}
              </Text>
              {car.variant ? (
                <Text variant="caption" color="textSecondary">
                  {car.variant}
                </Text>
              ) : null}

              <View style={styles.specsRow}>
                {[car.km, car.fuel, car.transmission].filter(Boolean).map((spec, i) => (
                  <View key={i} style={styles.specChip}>
                    <Text variant="caption" color="textSecondary">
                      {spec}
                    </Text>
                  </View>
                ))}
              </View>

              <Text variant="h3" color="textPrimary" style={styles.price}>
                {car.price}
              </Text>
              {car.emi ? (
                <Text variant="caption" color="textSecondary">
                  {car.emi}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  title: { marginBottom: spacing.sm },
  tabsRow: { flexDirection: 'row', marginBottom: spacing.md },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  tabActive: { borderColor: colors.primary, backgroundColor: '#EEF0FD' },
  card: {
    width: 200,
    marginRight: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: { width: '100%', height: 120 },
  badge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  details: { padding: spacing.sm },
  specsRow: { flexDirection: 'row', marginVertical: spacing.xs, flexWrap: 'wrap' },
  specChip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  price: { marginTop: spacing.xs },
});