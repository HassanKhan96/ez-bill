export interface Size {
    id: string;
    name: string;
    price: number;
}

export interface Item {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    image?: string;
    basePrice: number;
    sizes: Size[] | null;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface CartItem extends Item {
    cartId: string; // Unique ID for the item in the cart (to handle same item with different sizes/modifiers if needed)
    quantity: number;
    selectedSize?: Size;
    totalPrice: number;
}

export interface Order {
    id: string;
    sequence: number;
    items: CartItem[];
    subTotal: number;
    tax: number;
    discount: number;
    total: number;
    timestamp: number;
}
