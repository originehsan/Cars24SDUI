import React from 'react';
import { View, ScrollView, TextInput, StyleSheet, Pressable } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Tab {
  id: string;
  label: string;
  iconUrl?: string;
}

interface Props {
  location: string;
  placeholder: string;
  tabs: Tab[];
}

export function HeaderSearch({ location, placeholder, tabs }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text variant="label" color="textOnPrimary">📍 {location}</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={false} // visual only for now — wiring search comes later
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {tabs.map((tab) => (
          <Pressable key={tab.id} style={styles.tabChip}>
            <Text variant="label" color="textOnPrimary">
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  topRow: { marginBottom: spacing.sm },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.textOnPrimary,
    marginBottom: spacing.md,
  },
  tabsRow: { flexDirection: 'row' },
  tabChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});