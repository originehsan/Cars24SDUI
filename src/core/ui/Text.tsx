import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@core/theme/tokens';

type Variant = keyof typeof typography;

interface Props extends RNTextProps {
  variant?: Variant;
  color?: keyof typeof colors;
}

export function Text({ variant = 'body', color = 'textPrimary', style, ...rest }: Props) {
  return (
    <RNText
      style={[styles.base, typography[variant], { color: colors[color] }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false }, // avoids extra vertical padding on Android
});