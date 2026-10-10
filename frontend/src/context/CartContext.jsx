import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalItemsCount: 0,
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        totalItemsCount: 0,
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        totalAmount: 0
      });
      return;
    }

    try {
      setLoading(true);
      const res = await cartApi.get();
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }
    try {
      const res = await cartApi.add(foodId, quantity);
      if (res.data.success) {
        setCart(res.data.data);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add dish to bag'
      };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await cartApi.updateItem(cartItemId, quantity);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await cartApi.removeItem(cartItemId);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clear();
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
    }
  };

  const value = {
    cart,
    loading,
    isDrawerOpen,
    setIsDrawerOpen,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
