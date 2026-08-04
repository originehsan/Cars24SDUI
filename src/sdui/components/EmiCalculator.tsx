import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, Button } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { calculateEmi, formatIndianNumber } from '@core/utils/emiCalculator';
import { runActions } from '@sdui/actions/actionHandler';

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
}

export function EmiCalculator({ principal, interestRatePercent, downPayment, durationMonths, eligibilityActions }: Props) {
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
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
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
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
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

      <View style={styles.breakdownRow}>
        <View>
          <Text variant="caption" color="textSecondary">
            Principal
          </Text>
          <Text variant="h3">₹{formatIndianNumber(loanAmount)}</Text>
        </View>
        <View>
          <Text variant="caption" color="textSecondary">
            Interest
          </Text>
          <Text variant="h3">₹{formatIndianNumber(totalInterest)}</Text>
        </View>
      </View>

      <Text variant="caption" color="textMuted" style={styles.disclaimer}>
        *Final EMI is calculated after income verification.
      </Text>
      <Button label="Check eligibility" variant="primary" onPress={() => runActions(eligibilityActions as any)} />
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
  sliderBlock: { marginBottom: spacing.lg },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  sliderRange: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  disclaimer: { marginBottom: spacing.md, textAlign: 'center' },
});