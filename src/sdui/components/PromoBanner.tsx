import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Props {
  imageUrl?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
}

export function PromoBanner({ imageUrl, eyebrow, title, subtitle, ctaLabel }: Props) {
  return (
    <View style={styles.container}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

      <View style={styles.overlay}>
        {eyebrow ? (
          <Text variant="caption" color="accent" style={styles.eyebrow}>
            {eyebrow.toUpperCase()}
          </Text>
        ) : null}
        <Text variant="h2" color="textOnPrimary">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" color="textOnPrimary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {ctaLabel ? (
          <Button label={ctaLabel} variant="secondary" style={styles.cta} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
    minHeight: 140,
  },
  image: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.5,
},
  overlay: { padding: spacing.lg },
  eyebrow: { marginBottom: spacing.xs, fontWeight: '700' },
  subtitle: { marginTop: spacing.xs, opacity: 0.85 },
  cta: { marginTop: spacing.md, alignSelf: 'flex-start' },
});