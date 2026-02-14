
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewOrderScreen from '../screens/NewOrderScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

const OrderStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="NewOrder" component={NewOrderScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
    );
};

export default OrderStackNavigator;
