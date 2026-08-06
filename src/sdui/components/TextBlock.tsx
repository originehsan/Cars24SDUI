import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { spacing } from '@core/theme/tokens';

interface Props {
  text: string;
  align?: 'left' | 'center' | 'right';
  textColor?: string;
  minHeight?: number;
  size?: 'default' | 'large';
}

export function TextBlock({ text, align = 'left', textColor, minHeight, size = 'default' }: Props) {
  return (
    <View style={[styles.container, minHeight ? { minHeight } : null]}>
      <Text
        variant={size === 'large' ? 'h1' : 'body'}
        style={[
          styles.text,
          { textAlign: align },
          size === 'large' ? styles.textLarge : null,
          textColor ? { color: textColor } : null,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  text: {},
  textLarge: { lineHeight: 30 },
});