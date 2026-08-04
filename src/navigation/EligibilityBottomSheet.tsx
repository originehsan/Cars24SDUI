import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, Button } from '@core/ui';
import { colors, spacing } from '@core/theme/tokens';
import { useSheetStore } from '@core/store/useSheetStore';

export function EligibilityBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const isOpen = useSheetStore((s) => s.isEligibilitySheetOpen);
  const closeSheet = useSheetStore((s) => s.closeEligibilitySheet);
  const snapPoints = useMemo(() => ['40%'], []);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) closeSheet();
    },
    [closeSheet],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChange}
    >
      <BottomSheetView style={styles.content}>
        <Text variant="h2">Check your eligibility</Text>
        <Text variant="body" color="textSecondary" style={styles.body}>
          We'll verify your income details to confirm your final EMI amount.
          This usually takes under a minute.
        </Text>
        <Button label="Confirm" variant="primary" onPress={closeSheet} />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  body: { marginVertical: spacing.md },
});