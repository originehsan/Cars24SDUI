import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
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

type TabIconName = 'view-grid' | 'car' | 'key' | 'cash';

const TAB_ICONS: Record<string, TabIconName> = {
  all: 'view-grid',
  buy: 'car',
  sell: 'key',
  loans: 'cash',
};

export function HeaderSearch({ location, placeholder, tabs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.locationGroup}>
          <MaterialDesignIcons name="map-marker" size={16} color={colors.textOnPrimary} />
          <Text variant="label" color="textOnPrimary" style={styles.locationText}>
            {location}
          </Text>
        </View>
        <Pressable style={styles.profileButton}>
          <MaterialDesignIcons name="account" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={false} // visual only for now — wiring search comes later
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const iconName = TAB_ICONS[tab.id] ?? 'car';
          return (
            <Pressable key={tab.id} style={styles.tabChip} onPress={() => setActiveTab(tab.id)}>
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <MaterialDesignIcons
                  name={iconName}
                  size={20}
                  color={isActive ? colors.primary : colors.textOnPrimary}
                />
              </View>
              <Text variant="label" color="textOnPrimary" style={styles.tabLabel}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  locationGroup: { flexDirection: 'row', alignItems: 'center' },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.textOnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: { marginLeft: spacing.xs },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.textOnPrimary,
    marginBottom: spacing.md,
  },
  tabsRow: { flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between' },
  tabChip: {
    alignItems: 'center',
    width: 64,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconCircleActive: {
    backgroundColor: colors.textOnPrimary,
  },
  tabLabel: { textAlign: 'center' },
});