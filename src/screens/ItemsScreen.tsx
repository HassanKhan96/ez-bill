
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useInventory, Item } from '../context/InventoryContext';
import { useNavigation } from '@react-navigation/native';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const ItemsScreen = () => {
    const navigation = useNavigation();
    const { items, categories, addItem, updateItem, deleteItem } = useInventory();
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState<{ name?: string; price?: string; category?: string }>({});

    const openModal = (item?: Item) => {
        setErrors({});
        if (item) {
            setIsEditing(true);
            setEditingId(item.id);
            setName(item.name);
            setPrice(item.price.toString());
            setSelectedCategory(item.categoryId);
            setImageUrl(item.image || '');
        } else {
            setIsEditing(false);
            setEditingId(null);
            setName('');
            setPrice('');
            setSelectedCategory('');
            setImageUrl('');
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        const newErrors: { name?: string; price?: string; category?: string } = {};

        if (!name.trim()) newErrors.name = "Item name is required";
        if (!price.trim()) {
            newErrors.price = "Price is required";
        } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            newErrors.price = "Price must be a valid number";
        }
        if (!selectedCategory) newErrors.category = "Category is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const itemData: Item = {
            id: isEditing && editingId ? editingId : generateId(),
            name: name.trim(),
            price: parseFloat(price),
            categoryId: selectedCategory,
            image: imageUrl.trim(),
        };

        if (isEditing) {
            await updateItem(itemData);
        } else {
            await addItem(itemData);
        }
        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setSelectedCategory('');
        setImageUrl('');
    };

    const handleDeleteItem = (id: string) => {
        Alert.alert(
            'Delete Item',
            'Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
            ]
        );
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.8}
            onPress={() => openModal(item)}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemSubText}>Rs. {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
            }}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Items</Text>
                <TouchableOpacity style={styles.addButtonHeader} onPress={() => openModal()}>
                    <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No items found. Add one using the + button.</Text>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Edit Item' : 'Add New Item'}</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <CustomInput
                                label="Item Name"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (errors.name) setErrors({ ...errors, name: undefined });
                                }}
                                placeholder="Enter item name"
                                error={errors.name}
                            />
                            <CustomInput
                                label="Price"
                                value={price}
                                onChangeText={(text) => {
                                    setPrice(text);
                                    if (errors.price) setErrors({ ...errors, price: undefined });
                                }}
                                placeholder="0.00"
                                keyboardType="numeric"
                                error={errors.price}
                            />

                            <Text style={styles.label}>Category</Text>
                            <View style={styles.categoriesContainer}>
                                {categories.map(cat => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategory === cat.id && styles.categoryChipSelected,
                                            errors.category && !selectedCategory ? { borderColor: COLORS.error } : null
                                        ]}
                                        onPress={() => {
                                            setSelectedCategory(cat.id);
                                            if (errors.category) setErrors({ ...errors, category: undefined });
                                        }}
                                    >
                                        <Text style={[
                                            styles.categoryChipText,
                                            selectedCategory === cat.id && styles.categoryChipTextSelected
                                        ]}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                {categories.length === 0 && <Text style={styles.helperText}>No categories available. Please add categories first.</Text>}
                            </View>
                            {errors.category && <Text style={[styles.helperText, { marginTop: -hp(1), marginBottom: hp(1) }]}>{errors.category}</Text>}

                            <CustomInput
                                label="Image URL (Optional)"
                                value={imageUrl}
                                onChangeText={setImageUrl}
                                placeholder="https://example.com/image.png"
                            />

                            <View style={styles.modalButtons}>
                                <CustomButton
                                    title="Cancel"
                                    type="outline"
                                    onPress={() => setModalVisible(false)}
                                    style={{ flex: 1, marginRight: SIZES.small }}
                                />
                                <CustomButton
                                    title="Save Item"
                                    onPress={handleSave}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: SIZES.medium,
    },
    addButtonHeader: {
        padding: SIZES.small,
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    listContent: {
        padding: SIZES.padding,
        paddingBottom: hp(5),
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.small,
        ...SHADOWS.light,
    },
    itemText: {
        fontSize: SIZES.medium,
        color: COLORS.text,
        fontWeight: '500',
    },
    itemSubText: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: hp(5),
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
        maxHeight: hp(80),
    },
    modalTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginBottom: hp(2),
        color: COLORS.text,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: hp(2),
    },
    label: {
        fontSize: SIZES.font,
        color: COLORS.text,
        marginBottom: hp(0.5),
        fontWeight: '500',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: hp(2)
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
    },
    categoryChipTextSelected: {
        color: COLORS.white,
    },
    helperText: {
        fontSize: SIZES.small,
        color: COLORS.error,
    }
});

export default ItemsScreen;
