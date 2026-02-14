
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import OrderStackNavigator from './OrderStackNavigator';
import InventoryStackNavigator from './InventoryStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import OrderHistoryStackNavigator from './OrderHistoryStackNavigator';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Order') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Inventory') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'alert-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Order" component={OrderStackNavigator} />
            <Tab.Screen name="History" component={OrderHistoryStackNavigator} />
            <Tab.Screen name="Inventory" component={InventoryStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
