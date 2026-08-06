import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SDUIScreen } from '@sdui/registry/renderer';
import { useSduiScreen } from '@core/hooks/useSduiScreen';
import { colors, spacing } from '@core/theme/tokens';

export function CarDetailScreen() {
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  const { data, isLoading, error } = useSduiScreen('car_detail');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(colors.surface);
    }, []),
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Failed to load screen: {(error as Error).message}</Text>
      </View>
    );
  }

  // Plain-JS peek at screen-level header-summary fields — same
  // zero-validation-cost pattern used elsewhere for peeking at raw
  // JSON. These are display-only fields alongside `sections`, not
  // something SDUIScreen's own section validation needs to know about.
  const screen = data as { screenTitle?: string; headerPrice?: string; headerEmi?: string } | null;

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
         <MaterialDesignIcons name="chevron-left" size={28} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTextBlock}>
          {screen?.screenTitle ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {screen.screenTitle}
            </Text>
          ) : null}
          {screen?.headerEmi || screen?.headerPrice ? (
            <Text style={styles.headerSummary} numberOfLines={1}>
              {[screen?.headerEmi, screen?.headerPrice].filter(Boolean).join('  ·  ')}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerIcons}>
          <MaterialDesignIcons
            name="heart-outline"
            size={22}
            color={colors.textPrimary}
            style={styles.headerIcon}
          />
          <MaterialDesignIcons name="share-variant-outline" size={22} color={colors.textPrimary} />
        </View>
      </View>

      <SDUIScreen raw={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTextBlock: { flex: 1, marginLeft: spacing.md },
  headerTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  headerSummary: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: spacing.md },
});