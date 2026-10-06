"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-6">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-background shadow-2xl flex flex-col z-10 border-l border-border"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-background">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-primary text-background flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground uppercase tracking-tighter leading-tight">
                  Shopping Bag
                </h2>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-4 bg-secondary/50 border-b border-border text-xs">
            <div className="flex items-center justify-between mb-2 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 text-foreground">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-primary">{formatPrice(remainingForFreeDelivery)}</strong> for FREE Delivery
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-background overflow-hidden border border-border/50">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeDelivery === 0 ? "bg-green-500" : "bg-primary"
                }`}
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-[20px] bg-secondary flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">Your bag is empty</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto font-medium">
                    Explore fast chargers, braided cables and cases to power up your devices.
                  </p>
                </div>
                <Button
                  onClick={closeCart}
                  asChild
                  className="bg-primary hover:bg-accent text-primary-foreground font-black rounded-full text-xs px-8 h-12 uppercase tracking-widest shadow-md mt-4"
                >
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-4 p-4 rounded-[16px] bg-secondary border border-border items-center group shadow-sm"
                >
                  <div className="relative w-16 h-16 rounded-[12px] bg-background border border-border overflow-hidden shrink-0">
                    <Image
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200"
                      }
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-foreground line-clamp-1 uppercase">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 block">
                        {item.variantName}
                      </span>
                    )}
                    <div className="text-sm font-black text-foreground mt-1 font-mono">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-border rounded-full bg-background p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-full cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-[11px] font-black text-foreground font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-full cursor-pointer"
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
            <div className="p-6 border-t border-border bg-background space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
              <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-foreground font-mono">
                    {remainingForFreeDelivery === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(STORE_CONFIG.defaultDeliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-foreground pt-3 border-t border-border/50">
                  <span>Estimated Total</span>
                  <span className="text-primary font-mono text-base">
                    {formatPrice(
                      subtotal + (remainingForFreeDelivery === 0 ? 0 : STORE_CONFIG.defaultDeliveryFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={closeCart}
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-background font-black rounded-full h-14 text-sm uppercase tracking-widest cursor-pointer shadow-xl transition-all duration-300"
                >
                  <Link href="/checkout" className="flex items-center justify-center gap-2">
                    Checkout Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  onClick={closeCart}
                  asChild
                  variant="outline"
                  className="w-full bg-secondary hover:bg-border/50 text-foreground font-bold rounded-full h-12 text-xs uppercase tracking-widest border-border cursor-pointer transition-colors"
                >
                  <Link href="/cart">View Full Bag</Link>
                </Button>
              </div>

              {/* Trust Badge Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Fast Shipping
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> COD Available
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
