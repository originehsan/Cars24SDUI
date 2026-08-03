import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/** TEMPORARY: minimal debug-only components, to be replaced with real
 * UI (built from core/ui primitives) once the renderer pipeline is
 * verified end-to-end. Each will move to its own folder later per
 * AGENTS.md's "one new file per component type" rule. */

function Placeholder({ label, data }: { label: string; data: unknown }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.data} numberOfLines={2}>
        {JSON.stringify(data)}
      </Text>
    </View>
  );
}

export function HeaderSearch(props: unknown) {
  return <Placeholder label="header_search" data={props} />;
}
export function IconLinkGrid(props: unknown) {
  return <Placeholder label="icon_link_grid" data={props} />;
}
export function CardRail(props: unknown) {
  return <Placeholder label="card_rail" data={props} />;
}
export function CarListingRail(props: unknown) {
  return <Placeholder label="car_listing_rail" data={props} />;
}
export function PromoBanner(props: unknown) {
  return <Placeholder label="promo_banner" data={props} />;
}
export function LocationCard(props: unknown) {
  return <Placeholder label="location_card" data={props} />;
}
export function FeatureList(props: unknown) {
  return <Placeholder label="feature_list" data={props} />;
}
export function SpecGrid(props: unknown) {
  return <Placeholder label="spec_grid" data={props} />;
}
export function TabbedContent(props: unknown) {
  return <Placeholder label="tabbed_content" data={props} />;
}
export function ImageGallery(props: unknown) {
  return <Placeholder label="image_gallery" data={props} />;
}
export function EmiCalculator(props: unknown) {
  return <Placeholder label="emi_calculator" data={props} />;
}
export function TextBlock(props: unknown) {
  return <Placeholder label="text_block" data={props} />;
}
export function LinkList(props: unknown) {
  return <Placeholder label="link_list" data={props} />;
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    margin: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  label: { fontWeight: '600', fontSize: 13, color: '#1565C0' },
  data: { fontSize: 10, color: '#555', marginTop: 4 },
});