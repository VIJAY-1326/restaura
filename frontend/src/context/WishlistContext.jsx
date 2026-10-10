import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const res = await wishlistApi.get();
      if (res.data.success) {
        setWishlistItems(res.data.data);
        const idSet = new Set();
        res.data.data.forEach((item) => {
          idSet.add(item.id);
        });
        setWishlistIds(idSet);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (foodId) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    try {
      const res = await wishlistApi.toggle(foodId);
      if (res.data.success) {
        const idSet = new Set();
        res.data.wishlistFoodIds.forEach((id) => {
          idSet.add(id);
        });
        setWishlistIds(idSet);
        fetchWishlist();
        return { success: true, isWishlisted: res.data.isWishlisted, message: res.data.message };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: 'Could not update wishlist' };
    }
  };

  const isWishlisted = (foodId) => {
    return wishlistIds.has(Number(foodId));
  };

  const value = {
    wishlistItems,
    wishlistIds,
    loading,
    fetchWishlist,
    toggleWishlist,
    isWishlisted
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
