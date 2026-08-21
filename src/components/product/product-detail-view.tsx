"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductWithDetails } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { buildWhatsAppProductInquiryUrl, STORE_CONFIG } from "@/lib/config/store";
import { ProductGallery } from "./product-gallery";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Sparkles,
  Share2,
  Package,
  Layers,
} from "lucide-react";

interface ProductDetailViewProps {
  product: ProductWithDetails;
  relatedProducts: ProductWithDetails[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "delivery">("overview");

  // Determine current active variant
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) || null;
  const currentPrice = selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = product.price;
  const discount = product.salePrice
    ? calculateDiscountPercentage(product.price, product.salePrice)
    : 0;

  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= product.lowStockThreshold;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariantId, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariantId, quantity);
    router.push("/checkout");
  };

  const whatsAppInquiryUrl = buildWhatsAppProductInquiryUrl(
    product.name,
    selectedVariant?.sku || product.sku
  );

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/shop" className="hover:text-slate-900 transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-slate-900 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <ProductGallery images={product.images || []} productName={product.name} />
            </div>

            {/* Product Meta & Buying Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Brand & Stock Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-blue-200">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-slate-800">4.9</span>
                    <span className="text-slate-400">(48 reviews)</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  SKU: <span className="text-slate-700 font-bold">{selectedVariant?.sku || product.sku}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-950">
                      {formatPrice(currentPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                    Inclusive of all taxes • Pay via Cash on Delivery or Bank Transfer
                  </span>
                </div>

                {discount > 0 && (
                  <div className="self-start sm:self-auto bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
                    SAVE {discount}%
                  </div>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Option / Model:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === selectedVariantId;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="leading-tight">{variant.name}</div>
                          {variant.price && (
                            <div className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                              {formatPrice(variant.price)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="pt-2">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Currently Out of Stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600 shrink-0" />
                    <span>Hurry! Only {currentStock} units left in stock</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In Stock — Ready for Immediate Dispatch</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Add to Cart / Buy Now CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-950 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-slate-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= currentStock || isOutOfStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-950 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl h-12 text-sm shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>

                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl h-12 text-sm shadow-xl shadow-blue-600/25"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300 mr-2" />
                  Buy Now — Fast Cash on Delivery
                </Button>
              </div>

              {/* WhatsApp Quick Inquiry Card */}
              <div className="pt-2">
                <a
                  href={whatsAppInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Have questions about this item?</div>
                      <div className="text-[11px] text-emerald-700 font-medium">Inquire with product SKU on WhatsApp</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Nationwide COD Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>100% Genuine Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>7-Day Replacement Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified Safe Packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Overview, Specs, Delivery */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "specs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "delivery"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Delivery &amp; Returns Policy
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 uppercase">Hardware Details</span>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5 pt-1">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-semibold text-slate-900">{product.brand}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">SKU</span>
                  <span className="font-mono font-semibold text-slate-900">{product.sku}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-900">{product.category?.name}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 uppercase">Compatibility &amp; Safety</span>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5 pt-1">
                  <span className="text-slate-500">Protection</span>
                  <span className="font-semibold text-slate-900">Over-voltage &amp; Thermal Guard</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Warranty</span>
                  <span className="font-semibold text-slate-900">7-Day Replacement Guarantee</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Origin</span>
                  <span className="font-semibold text-slate-900">100% Genuine Retail Pack</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Delivery Timing:</strong> Karachi orders are typically delivered within 24-48 hours. Lahore, Islamabad, Rawalpindi, Faisalabad, and other nationwide destinations are delivered within 2-4 business days via Leopards / TCS courier service.
              </p>
              <p>
                <strong>Free Delivery:</strong> All orders with a cart value of <strong>{formatPrice(STORE_CONFIG.freeDeliveryThreshold)}</strong> or above qualify for 100% free delivery nationwide. Standard flat delivery charge is {formatPrice(STORE_CONFIG.defaultDeliveryFee)}.
              </p>
              <p>
                <strong>Return &amp; Replacement:</strong> If your product arrives damaged or defective, reach out to our WhatsApp support within 7 days of delivery with your order receipt for a hassle-free replacement.
              </p>
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Frequently Bought Together
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Compatible accessories and companion gear</p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Explore All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
