"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { X, Trash2, Plus, Minus } from "lucide-react";

interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
  images?: string[];
}

function DiscountBadge({ unitPrice, regularPrice }: { unitPrice: number; regularPrice: number }) {
  if (!regularPrice || regularPrice <= unitPrice) return null;
  const pct = Math.round(((regularPrice - unitPrice) / regularPrice) * 100);
  return (
    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
      <span className="line-through">{formatPrice(regularPrice)}</span>
      <span className="ml-1.5 text-primary">{pct}% Off</span>
    </span>
  );
}

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, addItem, subtotal, totalItems } = useCart();
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  const freeDeliveryThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDelivery = remainingForFreeDelivery === 0 && items.length > 0;
  const deliveryFee = freeDelivery ? 0 : STORE_CONFIG.defaultDeliveryFee;

  // Fetch "You may also like" suggestions when drawer opens
  useEffect(() => {
    if (!isCartOpen || items.length === 0) return;
    const cartIds = new Set(items.map((i) => i.productId));
    fetch("/api/products?limit=8&inStock=true")
      .then((r) => r.json())
      .then((data) => {
        const products: SuggestionProduct[] = data.products || data || [];
        setSuggestions(products.filter((p) => !cartIds.has(p.id)).slice(0, 6));
      })
      .catch(() => setSuggestions([]));
  }, [isCartOpen, items.length]);

  const handleAddSuggestion = async (p: SuggestionProduct) => {
    setAddingId(p.id);
    try {
      addItem({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.slug,
        brand: "",
        imageUrl: p.imageUrl || (p.images && p.images[0]) || "",
        unitPrice: p.salePrice || p.price,
        regularPrice: p.price,
        quantity: 1,
        stockQuantity: 99,
      } as any);
    } finally {
      setTimeout(() => setAddingId(null), 400);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 250 }}
          className="w-screen max-w-md bg-white dark:bg-[#15181E] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#2A2F3A] flex items-center justify-between shrink-0">
            <h2 className="text-base font-bold tracking-wide text-gray-900 dark:text-gray-100 uppercase">
              Shopping Cart
              {totalItems > 0 && (
                <span className="ml-2 text-[12px] font-semibold text-gray-400 normal-case">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Your cart is empty</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Add some products to get started.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-8 py-3 rounded-full bg-primary hover:bg-accent text-white text-sm font-bold uppercase tracking-wide transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="divide-y divide-gray-100 dark:divide-[#2A2F3A]">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || "default"}`} className="px-5 py-4 flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg bg-gray-50 dark:bg-[#1C2028] overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1.5"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                        {item.variantName && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.variantName}</p>
                        )}
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                        <DiscountBadge unitPrice={item.unitPrice} regularPrice={item.regularPrice} />

                        {/* Qty pill + trash */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center border border-gray-200 dark:border-[#2A2F3A] rounded-full">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* You may also like */}
                {suggestions.length > 0 && (
                  <div className="px-5 py-4 border-t border-gray-100 dark:border-[#2A2F3A]">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 text-center mb-3">
                      You may also like
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          className="w-[140px] shrink-0 rounded-xl border border-gray-100 dark:border-[#2A2F3A] bg-white dark:bg-[#1C2028] p-2.5 flex flex-col"
                        >
                          <div className="relative w-full h-[90px] rounded-lg bg-gray-50 dark:bg-[#15181E] overflow-hidden">
                            <Image
                              src={p.imageUrl || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200"}
                              alt={p.name}
                              fill
                              sizes="140px"
                              className="object-contain p-1"
                            />
                          </div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mt-2 leading-tight flex-1">
                            {p.name}
                          </p>
                          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mt-1">
                            {formatPrice(p.salePrice || p.price)}
                          </p>
                          <button
                            onClick={() => handleAddSuggestion(p)}
                            disabled={addingId === p.id}
                            className="mt-2 w-full py-1.5 rounded-full bg-primary hover:bg-accent disabled:opacity-70 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                          >
                            {addingId === p.id ? "..." : "Add"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mx-5 mb-4 rounded-xl bg-gray-50 dark:bg-[#1C2028] p-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2.5">Order Summary</h3>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Invoice Total:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                    <span>Delivery Charges:</span>
                    {freeDelivery ? (
                      <span className="font-bold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(deliveryFee)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100 mt-2.5 pt-2.5 border-t border-gray-200 dark:border-[#2A2F3A]">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(subtotal + deliveryFee)}</span>
                  </div>
                </div>

                {freeDelivery && (
                  <p className="text-center text-sm font-semibold text-green-600 px-5 mb-4">
                    Congratulations! You&apos;ve got free shipping!
                  </p>
                )}
                {!freeDelivery && (
                  <p className="text-center text-[12px] text-gray-500 dark:text-gray-400 px-5 mb-4">
                    Add <span className="font-bold text-primary">{formatPrice(remainingForFreeDelivery)}</span> more for FREE delivery
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer buttons */}
          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 dark:border-[#2A2F3A] flex gap-3 shrink-0 bg-white dark:bg-[#15181E]">
              <Link
                href="/shop"
                onClick={closeCart}
                className="flex-1 py-3.5 rounded-full border border-gray-300 dark:border-[#3A4150] text-gray-700 dark:text-gray-200 text-[12px] font-bold uppercase tracking-widest text-center hover:border-gray-400 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 py-3.5 rounded-full bg-primary hover:bg-accent text-white text-[12px] font-bold uppercase tracking-widest text-center transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}



