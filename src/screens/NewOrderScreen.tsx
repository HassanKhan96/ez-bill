
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomInput from '../components/CustomInput';
import ProductCard from '../components/ProductCard';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useInventory, Item, ItemSize } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const NewOrderScreen = () => {
    const navigation = useNavigation<any>();
    const { items, categories } = useInventory();
    const { addToCart, cart, cartCount } = useCart();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Size selection modal state
    const [sizeModalVisible, setSizeModalVisible] = useState(false);
    const [selectedItemForSize, setSelectedItemForSize] = useState<Item | null>(null);

    // Filter items based on search and category
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchQuery, selectedCategory]);

    const handleAddToCart = (item: Item) => {
        if (item.sizes && item.sizes.length > 0) {
            setSelectedItemForSize(item);
            setSizeModalVisible(true);
        } else {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                categoryId: item.categoryId,
                image: item.image,
            });
        }
    };

    const handleAddSizeToCart = (size: ItemSize) => {
        if (selectedItemForSize) {
            addToCart({
                id: selectedItemForSize.id,
                name: `${selectedItemForSize.name} (${size.name})`,
                price: size.price,
                categoryId: selectedItemForSize.categoryId,
                image: selectedItemForSize.image,
                size: size.name,
            });
            setSizeModalVisible(false);
            setSelectedItemForSize(null);
        }
    };

    const getQuantityInCart = (itemId: string) => {
        // This is a bit complex if we have sizes, as we might want to show total quantity for that item ID
        // irrespective of size, or just 0 to indicate it's in cart. 
        // For simplicity, let's sum up all instances of this itemID in cart.
        return cart
            .filter((cartItem) => cartItem.id === itemId || (cartItem.name.startsWith(items.find(i => i.id === itemId)?.name || '')))
            .reduce((total, cartItem) => total + cartItem.quantity, 0);
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>New Order</Text>
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Ionicons name="cart" size={24} color={COLORS.primary} />
                    {cartCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <CustomInput
                    placeholder="Search items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    containerStyle={{ marginBottom: 0 }}
                    style={styles.searchInput}
                />
            </View>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            selectedCategory === null && styles.categoryChipSelected,
                        ]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === null && styles.categoryTextSelected,
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat.id && styles.categoryChipSelected,
                            ]}
                            onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === cat.id && styles.categoryTextSelected,
                                ]}
                            >
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={styles.productList}
                renderItem={({ item }) => (
                    <View style={{ width: wp(42), marginBottom: SIZES.medium }}>
                        <ProductCard
                            item={item}
                            onPress={() => handleAddToCart(item)}
                            onAdd={() => handleAddToCart(item)}
                            quantityInCart={getQuantityInCart(item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items found.</Text>
                    </View>
                }
            />

            {/* Size Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={sizeModalVisible}
                onRequestClose={() => setSizeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Size</Text>
                        <Text style={styles.modalSubtitle}>{selectedItemForSize?.name}</Text>

                        {selectedItemForSize?.sizes?.map((size) => (
                            <TouchableOpacity
                                key={size.id}
                                style={styles.sizeOption}
                                onPress={() => handleAddSizeToCart(size)}
                            >
                                <Text style={styles.sizeName}>{size.name}</Text>
                                <Text style={styles.sizePrice}>Rs. {size.price.toFixed(2)}</Text>
                            </TouchableOpacity>
                        ))}

                        <CustomButton
                            title="Cancel"
                            type="outline"
                            onPress={() => setSizeModalVisible(false)}
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
    title: {
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cartButton: {
        padding: SIZES.base,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: SIZES.padding,
        marginBottom: hp(2),
    },
    searchInput: {
        backgroundColor: COLORS.white,
        ...SHADOWS.light,
        borderWidth: 0,
    },
    categoryList: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: hp(2),
        gap: SIZES.small,
    },
    categoryChip: {
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.base,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: SIZES.font,
        color: COLORS.text,
    },
    categoryTextSelected: {
        color: COLORS.white,
    },
    productList: {
        padding: SIZES.padding,
        paddingBottom: hp(5),
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp(5),
    },
    emptyText: {
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
        marginBottom: SIZES.base,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: SIZES.medium,
        color: COLORS.textLight,
        marginBottom: hp(2),
        textAlign: 'center',
    },
    sizeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sizeName: {
        fontSize: SIZES.medium,
        fontWeight: '500',
    },
    sizePrice: {
        fontSize: SIZES.medium,
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default NewOrderScreen;
