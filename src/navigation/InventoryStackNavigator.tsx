
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InventoryScreen from '../screens/InventoryScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ItemsScreen from '../screens/ItemsScreen';

const Stack = createNativeStackNavigator();

const InventoryStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InventoryMain" component={InventoryScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Items" component={ItemsScreen} />
        </Stack.Navigator>
    );
};

export default InventoryStackNavigator;
