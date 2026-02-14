
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
    categoryId: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string, size?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.size === item.size
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += item.quantity || 1;
                return newCart;
            } else {
                return [...prevCart, { ...item, quantity: item.quantity || 1 }];
            }
        });
    };

    const removeFromCart = (id: string, size?: string) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(item.id === id && item.size === size))
        );
    };

    const updateQuantity = (id: string, quantity: number, size?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.size === size ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
