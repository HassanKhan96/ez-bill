
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CartItem } from '../context/CartContext';

interface Order {
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
}

const OrderListScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (isFocused) {
            loadOrders();
        }
    }, [isFocused]);

    const loadOrders = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem('@ez-bill:order_history');
            if (storedHistory) {
                setOrders(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error('Failed to load orders', error);
        }
    };

    const renderOrder = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.orderIdContainer}>
                    <Text style={styles.orderId}>Order #{item.id}</Text>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</Text>
                </View>
                <Text style={styles.totalAmount}>Rs. {item.total.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemsContainer}>
                <Text style={styles.itemsLabel}>{item.items.length} Items</Text>
                <Text style={styles.itemsText} numberOfLines={1}>
                    {item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Order History</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrder}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No orders yet.</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: hp(2),
    },
    title: {
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    listContent: {
        padding: SIZES.padding,
        paddingBottom: hp(5),
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.medium,
        marginBottom: SIZES.medium,
        ...SHADOWS.light,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.small,
    },
    orderIdContainer: {

    },
    orderId: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    date: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
        marginTop: 2,
    },
    totalAmount: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SIZES.small,
    },
    itemsContainer: {

    },
    itemsLabel: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    itemsText: {
        fontSize: SIZES.font,
        color: COLORS.text,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp(10),
    },
    emptyText: {
        marginTop: SIZES.medium,
        fontSize: SIZES.medium,
        color: COLORS.textLight,
    },
});

export default OrderListScreen;
