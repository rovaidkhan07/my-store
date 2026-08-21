"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from "lucide-react";

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  const freeDeliveryThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : STORE_CONFIG.defaultDeliveryFee;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Cart is Empty</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
          Looks like you haven&apos;t added any mobile accessories to your cart yet.
        </p>
        <Button asChild size="lg" className="mt-6 bg-blue-600 hover:bg-blue-700 font-bold">
          <Link href="/shop">Explore Accessories &amp; Deals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors self-start sm:self-auto cursor-pointer"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free shipping banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-2 text-slate-900">
                <Truck className="w-4 h-4 text-blue-600" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-blue-700">{formatPrice(remainingForFreeDelivery)}</strong> more to get FREE Delivery
                  </span>
                )}
              </span>
              <span className="text-blue-700">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || "def"}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                  <Image
                    src={item.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                    <span>{item.brand}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{item.sku}</span>
                  </div>

                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  {item.variantName && (
                    <p className="text-xs text-slate-500 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">
                      Option: {item.variantName}
                    </p>
                  )}

                  <div className="text-sm font-semibold text-slate-900 mt-2 sm:hidden">
                    {formatPrice(item.unitPrice)}
                  </div>
                </div>

                {/* Unit Price (Desktop) */}
                <div className="hidden sm:block text-right px-4">
                  <div className="text-xs text-slate-400">Unit Price</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatPrice(item.unitPrice)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-l-xl transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-r-xl transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="text-right sm:min-w-24">
                    <div className="text-base font-extrabold text-slate-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 sticky top-24">
            <h3 className="font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                <span>Estimated Total</span>
                <span className="text-xl text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            {/* Assurances */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Original Authentic Products Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Cash on Delivery Available Across Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
