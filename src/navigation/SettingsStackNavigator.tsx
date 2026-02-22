
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import PrinterSettingsScreen from '../screens/PrinterSettingsScreen';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} />
            <Stack.Screen name="PrinterSettings" component={PrinterSettingsScreen} />
        </Stack.Navigator>
    );
};

export default SettingsStackNavigator;
