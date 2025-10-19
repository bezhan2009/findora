"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, Service } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const getStorageKey = useCallback(() => {
    return user ? `bizmart-cart-${user.id}` : 'bizmart-cart-guest';
  }, [user]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(getStorageKey());
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Не удалось прочитать корзину из localStorage", error);
      setCartItems([]);
    }
  }, [getStorageKey]);

  const updateLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(items));
    } catch (error) {
      console.error("Не удалось сохранить корзину в localStorage", error);
    }
  };

  const addToCart = (service: Service) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === service.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map((i) =>
          i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const newItem: CartItem = {
          id: service.id,
          name: service.title,
          price: service.price,
          quantity: 1,
          image: service.images[0],
        };
        newItems = [...prevItems, newItem];
      }
      updateLocalStorage(newItems);
      toast({ title: 'Добавлено в корзину!', description: service.title });
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (!itemToRemove) return prevItems;
      
      const newItems = prevItems.filter((item) => item.id !== id);
      updateLocalStorage(newItems);
      toast({ title: 'Удалено из корзины', description: itemToRemove.name });
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems((prevItems) => {
      if(prevItems.length > 0) {
        updateLocalStorage([]);
        toast({ title: 'Корзина очищена' });
      }
      return [];
    });
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
