import React, { useState } from 'react';
import { View, ScrollView, TextInput, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from '@core/ui';
import { colors, spacing, radius } from '@core/theme/tokens';
import { useEffect } from 'react';
import { markStart, markEnd } from '@core/utils/perfTimer';

/**
 * Hardcoded, non-SDUI twin of the home screen — used ONLY for the
 * SDUI-vs-static performance benchmark (see PERF.md). No JSON parsing,
 * no registry lookup, no zod validation — every value below is a
 * literal, same as what home.json contains.
 */
export function StaticHomeScreen() {
    const [activeTab, setActiveTab] = useState('wishlisted');

    // No fetch, no parse — just mount-to-render. This is the baseline
    // the SDUI version's fetch+parse+build total gets compared against.
    useEffect(() => {
        const buildStart = markStart('view-build:static-home');
        requestAnimationFrame(() => markEnd('view-build:static-home', buildStart));
    }, []);
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="label" color="textOnPrimary">
                    📍 Ghaziabad
                </Text>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search used cars"
                    placeholderTextColor={colors.textMuted}
                    editable={false}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
                    {['All', 'Buy used car', 'Sell car', 'Loans'].map((label) => (
                        <View key={label} style={styles.tabChip}>
                            <Text variant="label" color="textOnPrimary">
                                {label}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Buy car rail */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text variant="h3">Buy car</Text>
                    <View style={styles.badge}>
                        <Text variant="caption" color="error">
                            Up to ₹80,000 off
                        </Text>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        { id: 'c1', title: 'All used cars', imageUrl: 'https://picsum.photos/seed/allcars/300/200' },
                        { id: 'c2', title: 'Budget used cars', imageUrl: 'https://picsum.photos/seed/budget/300/200' },
                        { id: 'c3', title: 'Premium used cars', imageUrl: 'https://picsum.photos/seed/premium/300/200' },
                    ].map((card) => (
                        <View key={card.id} style={styles.card}>
                            <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
                            <Text variant="label" style={styles.cardTitle}>
                                {card.title}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Car listing rail */}
            <View style={styles.section}>
                <Text variant="h3" style={styles.sectionTitle}>
                    Used cars you'll love
                </Text>
                <View style={styles.tabsRow2}>
                    {['wishlisted', 'hotdeals'].map((id) => {
                        const isActive = id === activeTab;
                        return (
                            <Pressable
                                key={id}
                                onPress={() => setActiveTab(id)}
                                style={[styles.tab, isActive && styles.tabActive]}
                            >
                                <Text variant="label" color={isActive ? 'primary' : 'textSecondary'}>
                                    {id === 'wishlisted' ? 'Wishlisted' : 'Hot deals'}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        {
                            id: 'car1',
                            title: '2023 Mahindra XUV300',
                            variant: 'W6 1.2 PETROL',
                            imageUrl: 'https://picsum.photos/seed/xuv300/300/200',
                            price: '₹6.60 lakh',
                            emi: 'EMI ₹11,651/m*',
                            km: '25,335 km',
                            fuel: 'Petrol',
                            transmission: 'Manual',
                            badge: 'Cars24 Owned stock',
                        },
                        {
                            id: 'car2',
                            title: '2012 Volkswagen Vento',
                            variant: 'HIGHLINE DIESEL 1.6',
                            imageUrl: 'https://picsum.photos/seed/vento/300/200',
                            price: '₹1.72 lakh',
                            km: '78,002 km',
                            fuel: 'Diesel',
                            transmission: 'Manual',
                            badge: 'Verified Direct seller',
                        },
                    ].map((car) => (
                        <View key={car.id} style={styles.carCard}>
                            <View>
                                <Image source={{ uri: car.imageUrl }} style={styles.carImage} />
                                <View style={styles.carBadge}>
                                    <Text variant="caption" color="textOnPrimary">
                                        {car.badge}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.carDetails}>
                                <Text variant="h3" numberOfLines={1}>
                                    {car.title}
                                </Text>
                                <Text variant="caption" color="textSecondary">
                                    {car.variant}
                                </Text>
                                <Text variant="caption" color="textSecondary">
                                    {car.km} · {car.fuel} · {car.transmission}
                                </Text>
                                <Text variant="h3" style={styles.price}>
                                    {car.price}
                                </Text>
                                {car.emi ? (
                                    <Text variant="caption" color="textSecondary">
                                        {car.emi}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text variant="body" color="textOnPrimary" style={styles.footerText}>
                    better drives, better lives — Made with love in Gurugram
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        backgroundColor: colors.primary,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    searchBar: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: radius.pill,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        color: colors.textOnPrimary,
        marginVertical: spacing.md,
    },
    tabsRow: { flexDirection: 'row' },
    tabChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        marginRight: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    section: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    sectionTitle: { marginBottom: spacing.sm },
    badge: {
        marginLeft: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.pill,
        backgroundColor: '#FDECEC',
    },
    card: {
        width: 140,
        marginRight: spacing.sm,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.primary,
    },
    cardImage: { width: '100%', height: 80 },
    cardTitle: { padding: spacing.sm, color: colors.textOnPrimary },
    tabsRow2: { flexDirection: 'row', marginBottom: spacing.md },
    tab: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
    },
    tabActive: { borderColor: colors.primary, backgroundColor: '#EEF0FD' },
    carCard: {
        width: 200,
        marginRight: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        backgroundColor: colors.surface,
    },
    carImage: { width: '100%', height: 120 },
    carBadge: {
        position: 'absolute',
        bottom: spacing.xs,
        left: spacing.xs,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    carDetails: { padding: spacing.sm },
    price: { marginTop: spacing.xs },
    footer: { backgroundColor: '#060B14', padding: spacing.lg },
    footerText: { textAlign: 'center' },
});