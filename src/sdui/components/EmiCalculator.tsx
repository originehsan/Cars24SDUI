import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, Button } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { calculateEmi, formatIndianNumber } from '@core/utils/emiCalculator';
import { runActions } from '@sdui/actions/actionHandler';
import { useSheetStore } from '@core/store/useSheetStore';

interface RangeConfig {
  min: number;
  max: number;
  default: number;
}

interface Props {
  principal: number;
  interestRatePercent: number;
  downPayment: RangeConfig;
  durationMonths: RangeConfig;
  eligibilityActions?: { type: string; target?: string; params?: Record<string, unknown> }[];
  tenureChangeActions?: { type: string; target?: string; params?: Record<string, unknown> }[];
}

export function EmiCalculator({ principal, interestRatePercent, downPayment, durationMonths, eligibilityActions, tenureChangeActions }: Props) {
  const openEligibilitySheet = useSheetStore((s) => s.openEligibilitySheet);
  const [downPaymentValue, setDownPaymentValue] = useState(downPayment.default);
  const [duration, setDuration] = useState(durationMonths.default);
  const loanAmount = principal - downPaymentValue;
  const emi = useMemo(
    () => calculateEmi(loanAmount, interestRatePercent, duration),
    [loanAmount, interestRatePercent, duration],
  );
  const totalInterest = emi * duration - loanAmount;

  return (
    <View style={styles.container}>
      <Text variant="h3">EMI Calculator</Text>

      <View style={styles.emiDisplay}>
        <Text variant="caption" color="textSecondary">
          EMI ESTIMATE
        </Text>
        <Text variant="h1">₹{formatIndianNumber(emi)}/month*</Text>
        <Text variant="caption" color="textSecondary">
          for {duration} months @ {interestRatePercent}% p.a.
        </Text>
      </View>

      <View style={styles.barContainer}>
        <View style={[styles.barSegment, { flex: Math.max(loanAmount, 1), backgroundColor: colors.infoLight }]} />
        <View style={[styles.barSegment, { flex: Math.max(totalInterest, 1), backgroundColor: colors.info }]} />
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: colors.infoLight }]} />
        <Text variant="label" style={styles.legendLabel}>
          Principal loan amount
        </Text>
        <Text variant="label">₹{formatIndianNumber(loanAmount)}</Text>
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
        <Text variant="label" style={styles.legendLabel}>
          Interest
        </Text>
        <Text variant="label">₹{formatIndianNumber(totalInterest)}</Text>
      </View>

      <View style={styles.sliderBlock}>
        <View style={styles.sliderHeader}>
          <Text variant="label">Down payment</Text>
          <Text variant="label">₹{formatIndianNumber(downPaymentValue)}</Text>
        </View>
        <Slider
          minimumValue={downPayment.min}
          maximumValue={downPayment.max}
          value={downPaymentValue}
          step={1000}
          onValueChange={setDownPaymentValue}
          onSlidingComplete={(value) =>
            runActions(
              tenureChangeActions?.map((a) => ({ ...a, params: { ...a.params, field: 'downPayment', value } })) as any,
            )
          }
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.sliderRange}>
          <Text variant="caption" color="textMuted">
            ₹{formatIndianNumber(downPayment.min)}
          </Text>
          <Text variant="caption" color="textMuted">
            ₹{formatIndianNumber(downPayment.max)}
          </Text>
        </View>
      </View>

      <View style={styles.sliderBlock}>
        <View style={styles.sliderHeader}>
          <Text variant="label">Duration of loan</Text>
          <Text variant="label">{duration} months</Text>
        </View>
        <Slider
          minimumValue={durationMonths.min}
          maximumValue={durationMonths.max}
          value={duration}
          step={1}
          onValueChange={setDuration}
          onSlidingComplete={(value) =>
            runActions(
              tenureChangeActions?.map((a) => ({ ...a, params: { ...a.params, field: 'duration', value } })) as any,
            )
          }
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.sliderRange}>
          <Text variant="caption" color="textMuted">
            {durationMonths.min} months
          </Text>
          <Text variant="caption" color="textMuted">
            {durationMonths.max} months
          </Text>
        </View>
      </View>

      <Text variant="caption" color="textMuted" style={styles.disclaimer}>
        *Final EMI is calculated after income verification.
      </Text>
      <Button
        label="Check eligibility"
        variant="primary"
        onPress={() => {
          runActions(eligibilityActions as any);
          openEligibilitySheet();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emiDisplay: { alignItems: 'center', marginVertical: spacing.lg },
  barContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  barSegment: { height: '100%' },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: radius.sm, marginRight: spacing.xs },
  legendLabel: { flex: 1 },
  sliderBlock: { marginTop: spacing.lg, marginBottom: spacing.lg },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  sliderRange: { flexDirection: 'row', justifyContent: 'space-between' },
  disclaimer: { marginBottom: spacing.md, textAlign: 'center' },
});