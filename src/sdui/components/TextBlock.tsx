import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { spacing } from '@core/theme/tokens';

interface Props {
  text: string;
  align?: 'left' | 'center' | 'right';
  textColor?: string;
  minHeight?: number;
}

export function TextBlock({ text, align = 'left', textColor, minHeight }: Props) {
  return (
    <View style={[styles.container, minHeight ? { minHeight } : null]}>
      <Text
        variant="body"
        style={[styles.text, { textAlign: align }, textColor ? { color: textColor } : null]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  text: {},
});