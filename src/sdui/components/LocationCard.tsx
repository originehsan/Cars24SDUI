import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button, Card } from '@core/ui';
import { runActions } from '@sdui/actions/actionHandler';
import { colors, spacing, radius } from '@core/theme/tokens';

interface Props {
  imageUrl?: string;
  name: string;
  address: string;
  distanceLabel?: string;
  statusLabel?: string;
  primaryActions?: { type: string; target?: string; params?: Record<string, unknown> }[];
  secondaryActions?: { type: string; target?: string; params?: Record<string, unknown> }[];
}
export function LocationCard({ imageUrl, name, address, distanceLabel, statusLabel, primaryActions, secondaryActions }: Props) {
  const isClosed = statusLabel?.toLowerCase().includes('closed');

  return (
    <View style={styles.container}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

      <Card style={styles.card}>
        <Text variant="h3">{name}</Text>
        <Text variant="body" color="textSecondary" style={styles.address}>
          {address}
        </Text>
        {distanceLabel ? (
          <Text variant="caption" color="primary">
            {distanceLabel}
          </Text>
        ) : null}
        {statusLabel ? (
          <Text variant="caption" color={isClosed ? 'error' : 'success'} style={styles.status}>
            {statusLabel}
          </Text>
        ) : null}

        <View style={styles.buttonsRow}>
          <Button label="Call us" variant="secondary" style={styles.button} onPress={() => runActions(secondaryActions as any)} />
          <Button label="View showroom" variant="primary" style={styles.button} onPress={() => runActions(primaryActions as any)} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: spacing.md, borderRadius: radius.lg, overflow: 'hidden' },
  image: { width: '100%', height: 140 },
  card: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  address: { marginTop: spacing.xs },
  status: { marginTop: spacing.xs },
  buttonsRow: { flexDirection: 'row', marginTop: spacing.md },
  button: { flex: 1, marginRight: spacing.sm },
});