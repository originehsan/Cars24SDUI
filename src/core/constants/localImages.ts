import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled car photos, keyed by a short string used in place of a URL
 * in SDUI JSON. Bundled (not hotlinked) so the app never depends on
 * network access to render these — reliable during a recording, and
 * avoids any question about where a remote photo came from.
 */
const LOCAL_IMAGES: Record<string, ImageSourcePropType> = {
  'xuv300-front': require('../../assets/images/cars/xuv300-front.jpg'),
  'xuv300-side': require('../../assets/images/cars/xuv300-side.jpg'),
  'xuv300-rear': require('../../assets/images/cars/xuv300-rear.jpg'),
  'vento-front': require('../../assets/images/cars/vento-front.jpg'),
  'return-guarantee-banner': require('../../assets/images/banners/return-guarantee-banner.jpg'),
};

/**
 * Resolves an imageUrl string from SDUI JSON to an Image source. A
 * recognized local key returns the bundled asset; anything else is
 * treated as a remote URL, unchanged — so this stays backward
 * compatible with any imageUrl we haven't bundled locally.
 */
export function resolveImageSource(imageKey: string): ImageSourcePropType {
  if (imageKey in LOCAL_IMAGES) {
    return LOCAL_IMAGES[imageKey];
  }
  return { uri: imageKey };
}