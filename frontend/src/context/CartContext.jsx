import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart items from localStorage on initial render
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart items from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        // Save cart items to localStorage whenever they change
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(x => x._id === item._id);
            if (exist) {
                // Increase quantity if item already exists
                return prevItems.map(x =>
                    x._id === item._id ? { ...exist, qty: exist.qty + 1 } : x
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { ...item, qty: 1 }];
            }
        });
        alert(`${item.name} added to cart!`);
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(x => x._id !== id));
    };

    const updateQuantity = (id, qty) => {
        const quantity = Number(qty);
        if (quantity < 1) return; // Quantity cannot be less than 1
        setCartItems(
            cartItems.map(x => (x._id === id ? { ...x, qty: quantity } : x))
        );
    };

    const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    const value = { cartItems, addToCart, removeFromCart, updateQuantity, itemsCount, totalPrice, clearCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};