import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Props extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, style, children, ...rest }: Props) {
  return (
    <View style={[styles.base, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  padded: { padding: spacing.md },
});