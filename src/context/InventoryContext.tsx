
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface ItemSize {
    id: string;
    name: string;
    price: number;
    position: number;
}

export interface Item {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    sizes?: ItemSize[];
}

interface InventoryContextType {
    categories: Category[];
    items: Item[];
    addCategory: (category: Category) => Promise<void>;
    updateCategory: (category: Category) => Promise<void>;
    addItem: (item: Item) => Promise<void>;
    updateItem: (item: Item) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
    CATEGORIES: '@ez-bill:categories',
    ITEMS: '@ez-bill:items',
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        refreshInventory();
    }, []);

    const refreshInventory = async () => {
        try {
            const storedCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
            const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);

            if (storedCategories) setCategories(JSON.parse(storedCategories));
            if (storedItems) setItems(JSON.parse(storedItems));
        } catch (error) {
            console.error('Failed to load inventory', error);
        }
    };

    const addCategory = async (category: Category) => {
        const newCategories = [...categories, category];
        setCategories(newCategories);
        await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
    };

    const updateCategory = async (category: Category) => {
        const newCategories = categories.map((c) => (c.id === category.id ? category : c));
        setCategories(newCategories);
        await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
    };

    const addItem = async (item: Item) => {
        const newItems = [...items, item];
        setItems(newItems);
        await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    };

    const updateItem = async (item: Item) => {
        const newItems = items.map((i) => (i.id === item.id ? item : i));
        setItems(newItems);
        await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    };

    const deleteCategory = async (id: string) => {
        const newCategories = categories.filter((c) => c.id !== id);
        setCategories(newCategories);
        await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));

        // Cascade delete items
        const newItems = items.filter((i) => i.categoryId !== id);
        setItems(newItems);
        await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    };

    const deleteItem = async (id: string) => {
        const newItems = items.filter((i) => i.id !== id);
        setItems(newItems);
        await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    };

    return (
        <InventoryContext.Provider
            value={{
                categories,
                items,
                addCategory,
                updateCategory,
                addItem,
                updateItem,
                deleteCategory,
                deleteItem,
                refreshInventory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within a InventoryProvider');
    }
    return context;
};
