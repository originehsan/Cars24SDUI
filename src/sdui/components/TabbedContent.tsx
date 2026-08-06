import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Text } from '@core/ui';
import { colors, spacing } from '@core/theme/tokens';

interface TabItem {
  label: string;
  value?: string;
  iconUrl?: string;
}

interface Tab {
  id: string;
  label: string;
  items: TabItem[];
}

interface Props {
  tabs: Tab[];
  defaultTabId?: string;
}

export function TabbedContent({ tabs, defaultTabId }: Props) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveId(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text variant="label" color={isActive ? 'primary' : 'textSecondary'}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.itemsGrid}>
        {activeTab?.items.map((item, i) => (
          <View key={i} style={styles.item}>
            {item.iconUrl ? (
              <MaterialDesignIcons name={item.iconUrl as any} size={20} color={colors.textPrimary} style={styles.icon} />
            ) : null}
            <Text variant="body">{item.label}</Text>
            {item.value ? (
              <Text variant="caption" color="textSecondary">
                {item.value}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  item: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  icon: { width: 20, height: 20, marginRight: spacing.sm },
});