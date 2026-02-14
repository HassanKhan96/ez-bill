
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InventoryScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Inventory Management</Text>
            </View>

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Categories')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
                        <Ionicons name="apps" size={32} color={COLORS.secondary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Categories</Text>
                        <Text style={styles.cardSubtitle}>Manage product categories</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Items')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                        <Ionicons name="cube" size={32} color={COLORS.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Items</Text>
                        <Text style={styles.cardSubtitle}>Manage products and prices</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: SIZES.medium,
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    container: {
        padding: SIZES.padding,
        gap: SIZES.medium,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        ...SHADOWS.light,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.medium,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
    cardSubtitle: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
    },
});

export default InventoryScreen;
