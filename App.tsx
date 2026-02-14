
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { InventoryProvider } from './src/context/InventoryContext';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <InventoryProvider>
        <CartProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </CartProvider>
      </InventoryProvider>
    </SafeAreaProvider>
  );
}
