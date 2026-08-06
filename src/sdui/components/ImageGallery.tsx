import React, { useState } from 'react';
import { View, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Dimensions, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { resolveImageSource } from '@core/constants/localImages';

interface Props {
  images: string[];
  badgeText?: string;
  overlayText?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ImageGallery({ images, badgeText, overlayText }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  return (
    <View>
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {images.map((uri, i) => (
            <Image key={i} source={resolveImageSource(uri)} style={styles.image} resizeMode="cover" />
          ))}
        </ScrollView>
        <View style={styles.scrim} pointerEvents="none" />
      </View>

      {badgeText ? (
        <View style={styles.badge}>
          <Text variant="caption" color="textOnPrimary">
            {badgeText}
          </Text>
        </View>
      ) : null}
      {overlayText ? (
        <View style={styles.overlay}>
          <Text variant="caption" color="textOnPrimary" numberOfLines={1}>
            {overlayText}
          </Text>
        </View>
      ) : null}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: SCREEN_WIDTH, height: 260 },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  overlay: {
    position: 'absolute',
    top: spacing.xl + spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: colors.primary, width: 16 },
});