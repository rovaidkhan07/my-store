"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sparkles } from "lucide-react";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right-full duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950 leading-tight">Shopping Cart</h2>
                <span className="text-xs text-slate-400 font-medium">{totalItems} {totalItems === 1 ? "item" : "items"} selected</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Unlocked FREE Delivery Nationwide!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-blue-600 font-black">{formatPrice(remainingForFreeDelivery)}</strong> for FREE Delivery
                  </span>
                )}
              </span>
              <span className="text-slate-500 font-bold">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeDelivery === 0
                    ? "bg-emerald-500 shadow-xs"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }`}
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore fast chargers, braided cables and cases to power up your devices.
                  </p>
                </div>
                <Button onClick={closeCart} asChild className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-xs">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 items-center group"
                >
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200/60 overflow-hidden shrink-0">
                    <Image
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200"
                      }
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[11px] font-semibold text-blue-600">
                        {item.variantName}
                      </span>
                    )}
                    <div className="text-xs font-black text-slate-950 mt-1">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-bold text-slate-900">
                    {remainingForFreeDelivery === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatPrice(STORE_CONFIG.defaultDeliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-blue-600">
                    {formatPrice(
                      subtotal + (remainingForFreeDelivery === 0 ? 0 : STORE_CONFIG.defaultDeliveryFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={closeCart}
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl h-12 text-xs shadow-xl shadow-blue-600/20 cursor-pointer"
                >
                  <Link href="/checkout" className="flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  onClick={closeCart}
                  asChild
                  variant="outline"
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-2xl h-10 text-xs border-slate-200 cursor-pointer"
                >
                  <Link href="/cart">View Full Cart Details</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
