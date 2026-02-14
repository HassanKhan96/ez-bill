
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useCart, CartItem } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = () => {
    const navigation = useNavigation<any>();
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const [discount, setDiscount] = useState('');
    const [taxRate, setTaxRate] = useState('10'); // Default 10% tax
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [errors, setErrors] = useState<{ discount?: string; tax?: string }>({});

    const validateAdjustments = () => {
        const newErrors: { discount?: string; tax?: string } = {};
        let isValid = true;

        if (discount && (isNaN(parseFloat(discount)) || parseFloat(discount) < 0)) {
            newErrors.discount = "Invalid discount amount";
            isValid = false;
        }

        if (taxRate && (isNaN(parseFloat(taxRate)) || parseFloat(taxRate) < 0)) {
            newErrors.tax = "Invalid tax rate";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const calculateTotal = () => {
        const subtotal = cartTotal;
        // Simple safe parsing, validation happens on 'Done' if needed, but here we just want to show safe numbers
        const discountAmount = !isNaN(parseFloat(discount)) ? parseFloat(discount) : 0;
        const rate = !isNaN(parseFloat(taxRate)) ? parseFloat(taxRate) : 0;

        const taxAmount = (subtotal - discountAmount) * (rate / 100);
        const finalTotal = subtotal - discountAmount + taxAmount;
        return {
            subtotal,
            discount: discountAmount,
            tax: taxAmount,
            total: finalTotal > 0 ? finalTotal : 0,
        };
    };

    const totals = calculateTotal();

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const order = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            items: cart,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
        };

        try {
            const existingHistory = await AsyncStorage.getItem('@ez-bill:order_history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            const newHistory = [order, ...history];
            await AsyncStorage.setItem('@ez-bill:order_history', JSON.stringify(newHistory));

            clearCart();
            setCheckoutModalVisible(false);
            Alert.alert('Success', 'Order created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('History') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save order');
        }
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                    {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                </Text>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                    style={styles.qtyButton}
                >
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                    style={styles.qtyButton}
                >
                    <Ionicons name="add" size={16} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => removeFromCart(item.id, item.size)}
                    style={[styles.qtyButton, { marginLeft: SIZES.small, borderColor: COLORS.error }]}
                >
                    <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Cart</Text>
                <TouchableOpacity onPress={clearCart}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.id + (item.size || '')}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>Cart is empty</Text>
                        <CustomButton
                            title="Browse Items"
                            onPress={() => navigation.navigate('NewOrder')}
                            type="outline"
                            style={{ marginTop: SIZES.medium }}
                        />
                    </View>
                }
            />

            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>Rs. {totals.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.success }]}>-Rs. {totals.discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>Rs. {totals.tax.toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>Rs. {totals.total.toFixed(2)}</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <CustomButton
                            title="Adjust Charges"
                            type="outline"
                            onPress={() => setCheckoutModalVisible(true)}
                            style={{ flex: 1, marginRight: SIZES.small }}
                        />
                        <CustomButton
                            title="Place Order"
                            onPress={handleCheckout}
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={checkoutModalVisible}
                onRequestClose={() => setCheckoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adjust Bill</Text>

                        <CustomInput
                            label="Discount Amount (Rs.)"
                            value={discount}
                            onChangeText={(text) => {
                                setDiscount(text);
                                if (errors.discount) setErrors({ ...errors, discount: undefined });
                            }}
                            keyboardType="numeric"
                            placeholder="0.00"
                            error={errors.discount}
                        />
                        <CustomInput
                            label="Tax Rate (%)"
                            value={taxRate}
                            onChangeText={(text) => {
                                setTaxRate(text);
                                if (errors.tax) setErrors({ ...errors, tax: undefined });
                            }}
                            keyboardType="numeric"
                            placeholder="10"
                            error={errors.tax}
                        />

                        <CustomButton
                            title="Done"
                            onPress={() => {
                                if (validateAdjustments()) {
                                    setCheckoutModalVisible(false);
                                }
                            }}
                            style={{ marginTop: hp(2) }}
                        />
                    </View>
                </View>
            </Modal>

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
    backButton: {
        padding: SIZES.base,
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    clearText: {
        color: COLORS.error,
        fontSize: SIZES.medium,
    },
    listContent: {
        padding: SIZES.padding,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.medium,
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        borderRadius: SIZES.radius,
        ...SHADOWS.light,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
    itemPrice: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: SIZES.small,
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
    footer: {
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        ...SHADOWS.medium,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    summaryLabel: {
        fontSize: SIZES.medium,
        color: COLORS.textLight,
    },
    summaryValue: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.small,
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
    actionButtons: {
        flexDirection: 'row',
        marginTop: SIZES.medium,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        padding: SIZES.padding,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
    },
    modalTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginBottom: hp(2),
        textAlign: 'center',
    },
});

export default CartScreen;
