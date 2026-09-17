'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  personalizedText?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  referralCode: string;
  setReferralCode: (code: string) => void;
  removeReferralCode: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [referralCode, setReferralCodeState] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper to set and save referral code
  const setReferralCode = (code: string) => {
    const sanitized = (code || '').trim().toUpperCase();
    setReferralCodeState(sanitized);
    try {
      if (sanitized) {
        localStorage.setItem('senaz_referral_code', sanitized);
      } else {
        localStorage.removeItem('senaz_referral_code');
      }
    } catch (e) {}
  };

  // Helper to remove referral code
  const removeReferralCode = () => {
    setReferralCodeState('');
    try {
      localStorage.removeItem('senaz_referral_code');
    } catch (e) {}
  };

  // Load from local storage and URL params on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('senaz_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('senaz_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');
        if (refFromUrl) {
          const sanitizedRef = refFromUrl.trim().toUpperCase();
          localStorage.setItem('senaz_referral_code', sanitizedRef);
          setReferralCodeState(sanitizedRef);
        } else {
          const savedRef = localStorage.getItem('senaz_referral_code');
          if (savedRef) setReferralCodeState(savedRef.trim().toUpperCase());
        }
      }
    } catch (e) {
      console.error('Failed to load local storage cart/wishlist', e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('senaz_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('senaz_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if identical item (same productId, color, size, personalizedText) exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size &&
          item.personalizedText === newItem.personalizedText
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        referralCode,
        setReferralCode,
        removeReferralCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
