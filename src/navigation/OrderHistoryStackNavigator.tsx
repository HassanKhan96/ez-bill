import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from '../screens/OrderListScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import { COLORS } from '../theme/theme';

const Stack = createNativeStackNavigator();

const OrderHistoryStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <Stack.Screen name="OrderList" component={OrderListScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </Stack.Navigator>
    );
};

export default OrderHistoryStackNavigator;
