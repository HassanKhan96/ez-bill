
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const order = route.params?.order as Order;

    if (!order) return null;

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Order Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Order Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Order ID</Text>
                        <Text style={styles.value}>#{order.id}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{new Date(order.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={[styles.divider]} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Time</Text>
                        <Text style={styles.value}>{new Date(order.date).toLocaleTimeString()}</Text>
                    </View>
                </View>

                {/* Items Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Items ({order.items.length})</Text>
                    <View style={styles.divider} />
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRowContainer}>
                            <View style={styles.itemRow}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                                    {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}
                                </View>
                                <Text style={styles.itemPrice}>Rs. {(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                            {index < order.items.length - 1 && <View style={styles.itemDivider} />}
                        </View>
                    ))}
                </View>

                {/* Payment Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Payment Summary</Text>
                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>Rs. {order.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.success }]}>-Rs. {order.discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>Rs. {order.tax.toFixed(2)}</Text>
                    </View>

                    <View style={styles.totalDivider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>Rs. {order.total.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>
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
    content: {
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
    cardTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.small,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.base,
    },
    label: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
    },
    value: {
        fontSize: SIZES.font,
        color: COLORS.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.small,
    },
    itemRowContainer: {
        marginBottom: SIZES.small,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemInfo: {
        flex: 1,
        paddingRight: SIZES.small,
    },
    itemName: {
        fontSize: SIZES.font,
        color: COLORS.text,
        fontWeight: '500',
    },
    itemSize: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: SIZES.font,
        color: COLORS.text,
        fontWeight: '600',
    },
    itemDivider: {
        height: 1,
        backgroundColor: COLORS.background, // lighter divider for items
        marginTop: SIZES.small,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    summaryLabel: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
    },
    summaryValue: {
        fontSize: SIZES.font,
        color: COLORS.text,
        fontWeight: '600',
    },
    totalDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.medium,
    },
    totalLabel: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default OrderDetailScreen;
