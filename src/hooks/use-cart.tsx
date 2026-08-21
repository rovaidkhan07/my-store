"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, ProductWithDetails } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (
    itemOrProduct: CartItem | ProductWithDetails,
    variantId?: string | null,
    quantity?: number
  ) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mobilehub_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (
    itemOrProduct: CartItem | ProductWithDetails,
    variantId?: string | null,
    qty = 1
  ) => {
    let resolvedItem: CartItem;

    if ("productId" in itemOrProduct) {
      // It is already a CartItem
      resolvedItem = itemOrProduct as CartItem;
    } else {
      // It is a ProductWithDetails
      const product = itemOrProduct as ProductWithDetails;
      const variant = product.variants?.find((v) => v.id === variantId) || null;
      const price = variant?.price || product.salePrice || product.price;
      const stock = variant ? variant.stockQuantity : product.stockQuantity;
      const image = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300";

      resolvedItem = {
        productId: product.id,
        variantId: variant?.id || null,
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        sku: variant?.sku || product.sku,
        imageUrl: image,
        unitPrice: price,
        regularPrice: product.price,
        quantity: qty,
        stockQuantity: stock,
        variantName: variant?.name,
      };
    }

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.productId === resolvedItem.productId &&
          (item.variantId || null) === (resolvedItem.variantId || null)
      );

      if (existingIndex > -1) {
        const updated = [...currentItems];
        const existing = updated[existingIndex];
        const newQty = Math.min(
          existing.quantity + resolvedItem.quantity,
          resolvedItem.stockQuantity || 99
        );
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          unitPrice: resolvedItem.unitPrice,
        };
        return updated;
      } else {
        return [...currentItems, resolvedItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            (item.variantId || null) === (variantId || null)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variantId: string | null | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId === productId &&
          (item.variantId || null) === (variantId || null)
        ) {
          const maxStock = item.stockQuantity || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalItems = itemCount;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
