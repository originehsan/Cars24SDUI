import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { ScreenShellSchema, SectionSchema } from '@sdui/schema/types';
import { isComponentType } from '@core/constants/componentTypes';
import { resolveComponent } from './componentRegistry';
import { UnknownComponentFallback } from './fallback';

function SDUINode({ raw }: { raw: unknown }) {
  // OPTIMIZATION (see PERF.md): this used to run two full zod passes per
  // node (shell + full schema). The type-peek below is plain JS — zero
  // validation cost — so we only pay for zod once, on the full schema.
  const peek = raw as { visible?: boolean; component?: { type?: string; id?: string } } | null;
  if (!peek || typeof peek !== 'object') {
    console.warn('[SDUI] Dropping malformed section (not an object)');
    return null;
  }
  if (peek.visible === false) return null;

  const rawType = peek.component?.type;
  if (typeof rawType !== 'string' || !isComponentType(rawType)) {
    return (
      <UnknownComponentFallback
        componentType={String(rawType)}
        componentId={String(peek.component?.id ?? 'unknown')}
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
      <View
        accessibilityLabel={section.accessibility?.accessibilityLabel}
        style={
          section.style
            ? {
                backgroundColor: section.style.backgroundColor,
              }
            : undefined
        }
      >
        <Component {...section.component.props} textColor={section.style?.textColor} />
      </View>
    </ErrorBoundary>
  );
}

export function SDUIScreen({ raw }: { raw: unknown }) {
  const shell = ScreenShellSchema.safeParse(raw);

  if (!shell.success) {
    console.error('[SDUI] Screen shell invalid:', shell.error.issues);
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {shell.data.sections.map((rawSection, index) => (
        <SDUINode key={index} raw={rawSection} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
});