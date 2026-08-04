import React from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { colors, spacing, radius } from '@core/theme/tokens';
import { Text } from './Text';

interface Props extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, variant = 'primary', style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style as object,
      ]}
      {...rest}
    >
      <Text variant="label" color={isPrimary ? 'textOnPrimary' : 'primary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.accentLight },
  pressed: { opacity: 0.75 },
});