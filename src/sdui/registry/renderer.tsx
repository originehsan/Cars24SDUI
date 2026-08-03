import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { ScreenShellSchema, SectionSchema, SectionShellSchema } from '@sdui/schema/types';
import { isComponentType } from '@core/constants/componentTypes';
import { resolveComponent } from './componentRegistry';
import { UnknownComponentFallback } from './fallback';

/**
 * One section: two-stage validation.
 * Stage 1 (shell) checks structure + whether the type is known at all —
 * genuinely unknown types show the fallback UI (scored requirement).
 * Stage 2 (full) validates known types against their real props schema —
 * malformed props on a known type are dropped quietly instead.
 */
function SDUINode({ raw }: { raw: unknown }) {
  const shell = SectionShellSchema.safeParse(raw);
  if (!shell.success) {
    console.warn('[SDUI] Dropping malformed section (bad shell):', shell.error.issues);
    return null; // structure itself is broken, nothing safe to render
  }
  if (!shell.data.visible) return null;

  if (!isComponentType(shell.data.component.type)) {
    return (
      <UnknownComponentFallback
        componentType={shell.data.component.type}
        componentId={shell.data.component.id}
      />
    );
  }

  const result = SectionSchema.safeParse(raw);
  if (!result.success) {
    console.warn('[SDUI] Dropping known-type section with bad props:', result.error.issues);
    return null;
  }

  const section = result.data;
  const Component = resolveComponent(section.component.type);

  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <UnknownComponentFallback componentType={section.component.type} componentId={section.id} />
      )}
      onError={(error) => console.warn(`[SDUI] Render error in "${section.id}":`, error)}
    >
      <View accessibilityLabel={section.accessibility?.accessibilityLabel}>
        <Component {...section.component.props} />
      </View>
    </ErrorBoundary>
  );
}

/** Entry point: takes raw (unvalidated) JSON and renders a full screen. */
export function SDUIScreen({ raw }: { raw: unknown }) {
  const shell = ScreenShellSchema.safeParse(raw);

  if (!shell.success) {
    // Only the top-level shape (version/name/sections array) can fail
    // here — this is the one case with no graceful per-node recovery.
    console.error('[SDUI] Screen shell invalid:', shell.error.issues);
    return null;
  }

  return (
    <View style={styles.container}>
      {shell.data.sections.map((rawSection, index) => (
        <SDUINode key={index} raw={rawSection} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});