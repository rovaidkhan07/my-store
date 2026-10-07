"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { buildWhatsAppProductInquiryUrl } from "@/lib/config/store";
import { Button } from "@/components/ui/button";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithDetails;
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  const selectedVariant = product.variants?.find((v) => v.id === activeVariantId) || null;
  const currentPrice = selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant?.id ?? null, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant?.id ?? null, quantity);
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Product quick view"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-lg font-black tracking-tight text-slate-950">
            {product.name}
          </span>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-secondary">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Product Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl bg-secondary overflow-hidden border border-border">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.images[0].altText || product.name}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Price & Info */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">
                  {formatPrice(currentPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Save {discount}%
                  </span>
                )}
              </div>

              <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Option:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setActiveVariantId(variant.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeVariantId === variant.id
                            ? "bg-[#f97316] text-white border-[#f97316] shadow-md"
                            : "bg-secondary text-slate-800 border-border hover:bg-stone-200"
                        }`}
                      >
                        {variant.name}
                        {variant.price && (
                          <span className="ml-1 text-[10px] opacity-70">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    Currently Out of Stock
                  </span>
                ) : currentStock <= 5 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                    Only {currentStock} units left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    In Stock — Ready for Immediate Dispatch
                  </span>
                )}
              </div>

              {/* Quantity & CTAs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl bg-white">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-secondary rounded-l-xl transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 18l-6-6l6-6" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= currentStock || isOutOfStock}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-secondary rounded-r-xl transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 6l6 6l6-6" />
                    </svg>
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl h-11 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1l4 4L23 1l6 6" />
                  </svg>
                  Add to Cart
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl h-11 text-sm flex items-center justify-center gap-2"
                >
                  Buy Now
                </Button>
              </div>

              {/* WhatsApp Inquiry */}
              <a
                href={buildWhatsAppProductInquiryUrl(product.name, selectedVariant?.sku || product.sku)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span>Inquire with product SKU on WhatsApp</span>
              </a>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-2">
                <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 11v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l1-3h5a2 2 0 0 1 2 2z" />
                  </svg>
                  COD Available
                </span>
                <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <svg className="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  100% Genuine
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}