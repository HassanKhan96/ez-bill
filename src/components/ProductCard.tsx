
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../context/InventoryContext';

interface ProductCardProps {
    item: Item;
    onPress: () => void;
    onAdd: () => void;
    quantityInCart?: number;
}

const ProductCard = ({ item, onPress, onAdd, quantityInCart = 0 }: ProductCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.container}
        >
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
                    </View>
                )}
                {quantityInCart > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{quantityInCart}</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>

                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Ionicons name="add" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        marginBottom: hp(2),
        ...SHADOWS.light,
        overflow: 'hidden',
    },
    imageContainer: {
        height: hp(15),
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.secondary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: SIZES.small,
        fontWeight: 'bold',
    },
    content: {
        padding: SIZES.small,
    },
    name: {
        fontSize: SIZES.font,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    price: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
    },
    addButton: {
        position: 'absolute',
        bottom: SIZES.small,
        right: SIZES.small,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
});

export default ProductCard;
