
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useInventory, Category } from '../context/InventoryContext';
import { useNavigation } from '@react-navigation/native';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const CategoriesScreen = () => {
    const navigation = useNavigation();
    const { categories, addCategory, updateCategory, deleteCategory } = useInventory();

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});

    const openModal = (category?: Category) => {
        setErrors({}); // Clear errors
        if (category) {
            setIsEditing(true);
            setEditingId(category.id);
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setIsEditing(false);
            setEditingId(null);
            setName('');
            setDescription('');
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setErrors({ name: 'Category name is required' });
            return;
        }

        if (isEditing && editingId) {
            await updateCategory({
                id: editingId,
                name: name.trim(),
                description: description.trim(),
            });
        } else {
            await addCategory({
                id: generateId(),
                name: name.trim(),
                description: description.trim(),
            });
        }
        setModalVisible(false);
    };

    const handleDeleteCategory = (id: string) => {
        Alert.alert(
            'Delete Category',
            'Are you sure? This will delete all items in this category.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(id) },
            ]
        );
    };

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => openModal(item)}
            activeOpacity={0.8}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.itemText}>{item.name}</Text>
                {item.description ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
            </View>
            <TouchableOpacity onPress={(e) => {
                e.stopPropagation(); // Prevent opening modal when clicking delete
                handleDeleteCategory(item.id);
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
                <Text style={styles.title}>Categories</Text>
                <TouchableOpacity onPress={() => openModal()} style={styles.addButton}>
                    <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No categories found. Add one above.</Text>
                    }
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Edit Category' : 'New Category'}</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <CustomInput
                                label="Name"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (errors.name) setErrors({ ...errors, name: undefined });
                                }}
                                placeholder="Category Name"
                                error={errors.name}
                            />
                            <CustomInput
                                label="Description"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Description (optional)"
                                multiline
                                numberOfLines={3}
                                style={{ height: 80, textAlignVertical: 'top' }}
                            />

                            <View style={styles.modalButtons}>
                                <CustomButton
                                    title="Cancel"
                                    type="outline"
                                    onPress={() => setModalVisible(false)}
                                    style={{ flex: 1, marginRight: SIZES.small }}
                                />
                                <CustomButton
                                    title="Save"
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
    addButton: {
        padding: SIZES.small,
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    content: {
        flex: 1,
        padding: SIZES.padding,
    },
    listContent: {
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
    itemDescription: {
        fontSize: SIZES.small,
        color: COLORS.textLight,
        marginTop: 2,
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
});

export default CategoriesScreen;
