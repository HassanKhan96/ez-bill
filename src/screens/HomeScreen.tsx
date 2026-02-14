
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const menuItems = [
    { id: 1, title: 'New Order', icon: 'cart', route: 'Order', color: COLORS.primary },
    { id: 2, title: 'History', icon: 'time', route: 'History', color: COLORS.secondary },
    { id: 3, title: 'Inventory', icon: 'list', route: 'Inventory', color: COLORS.warning },
    { id: 4, title: 'Settings', icon: 'settings', route: 'Settings', color: COLORS.textLight },
];

const HomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <View>
                    <Text style={styles.storeName}>Ez-Bill Store</Text>
                    <Text style={styles.subtitle}>Welcome back!</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.card, { borderColor: item.color }]}
                        onPress={() => navigation.navigate(item.route)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon as any} size={32} color={item.color} />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: SIZES.medium,
        color: COLORS.textLight,
    },
    profileButton: {
        padding: SIZES.base,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SIZES.padding,
        gap: SIZES.padding,
        justifyContent: 'space-between',
    },
    card: {
        width: wp(40),
        height: wp(40),
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.medium,
    },
    cardTitle: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
});

export default HomeScreen;
