"use client";

import React, { useState, useEffect } from "react";
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

// Extract color from variant attributes JSON string
const getColorFromAttributes = (attributes: string): string | null => {
  try {
    const parsed = JSON.parse(attributes);
    if (typeof parsed === "object" && parsed !== null) {
      const color = parsed.Color || parsed.color || parsed.COLOUR || parsed.colour;
      if (typeof color === "string" && color.trim()) {
        return color.trim();
      }
    }
  } catch {
    return null;
  }
  return null;
};

// Map common color names to hex values for swatch display
const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  midnight: "#2b3a4a",
  white: "#ffffff",
  arctic: "#e8f0f2",
  silver: "#c0c0c0",
  grey: "#808080",
  gray: "#808080",
  blue: "#3b82f6",
  navy: "#1e3a8a",
  green: "#16a34a",
  pine: "#14532d",
  red: "#dc2626",
  rose: "#e11d48",
  pink: "#ec4899",
  purple: "#7c3aed",
  lavender: "#c4b5fd",
  gold: "#f59e0b",
  amber: "#f59e0b",
  orange: "#f97316",
  yellow: "#facc15",
  brown: "#92400e",
  clear: "#f8fafc",
  transparent: "#f8fafc",
  space: "#4b5563",
};

const getColorHex = (color: string): string => {
  const normalized = color.toLowerCase().trim();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(key)) return hex;
  }
  return "#94a3b8";
};

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
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  // Sticky mobile add-to-cart bar visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past the product info section on mobile
      const scrollPosition = window.scrollY;
      const productInfoHeight = 800; // Approximate height of product gallery + meta
      setIsStickyBarVisible(scrollPosition > productInfoHeight && window.innerWidth < 1024);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-[#F8F9FA] min-h-screen pb-16 font-sans">
      
      {/* Page Header (Nevixra Style Breadcrumb Banner) */}
      <div className="bg-white py-10 border-b border-gray-100 mb-8 px-5 lg:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-500 uppercase tracking-wider overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href="/shop" className="hover:text-black transition-colors">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-black font-bold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-12">

        {/* Main Product Details Area */}
        <div className="bg-white border border-gray-100 p-6 sm:p-10 shadow-sm rounded-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <ProductGallery images={product.images || []} productName={product.name} />
            </div>

            {/* Product Meta & Buying Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Brand & Stock Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-[12px] font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-gray-800">4.9</span>
                    <span className="text-gray-400 font-medium ml-1">(48 reviews)</span>
                  </div>
                </div>

                <div className="text-[12px] text-gray-500 font-mono">
                  SKU: <span className="text-gray-900 font-bold">{selectedVariant?.sku || product.sku}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-[1.2]">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="p-5 bg-[#F8F9FA] border border-gray-100 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[28px] font-bold text-[#1A1A1A]">
                      {formatPrice(currentPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-[16px] text-gray-400 line-through font-semibold">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {discount > 0 && (
                  <div className="self-start sm:self-auto bg-[#FF4747] text-white text-[12px] font-bold px-3 py-1 rounded-sm">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block text-[12px] font-bold text-gray-900 uppercase tracking-wider">
                    Select Option / Model:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === selectedVariantId;
                      const color = getColorFromAttributes(variant.attributes);
                      const hasColor = color !== null;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-5 py-3 rounded-sm text-[13px] font-semibold transition-all border text-left cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? "bg-[#f97316] text-white border-[#f97316]"
                              : "bg-white text-gray-800 border-gray-200 hover:border-black"
                          }`}
                        >
                          {hasColor && (
                            <span
                              className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                                isSelected ? "border-black bg-white" : "border-gray-200"
                              }`}
                              style={{
                                backgroundColor: getColorHex(color),
                              }}
                            />
                          )}
                          <div className="leading-tight">{variant.name}</div>
                          {variant.price && (
                            <div className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
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
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Currently Out of Stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600 shrink-0" />
                    <span>Hurry! Only {currentStock} units left in stock</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In Stock — Ready for Immediate Dispatch</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Add to Cart / Buy Now CTAs */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-sm bg-slate-50 p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-gray-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= currentStock || isOutOfStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-sm h-12 text-sm shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>

                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  size="lg"
                  className="w-full bg-[#F4F5F7] border border-gray-200 hover:border-black text-black font-black rounded-sm h-12 text-sm shadow-xl shadow-blue-600/25"
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
                  className="w-full flex items-center justify-between p-3.5 rounded-sm bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <div className="w-8 h-8 rounded-sm bg-[#25D366] text-white flex items-center justify-center shadow-xs">
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
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-gray-600">
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
        <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "specs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "delivery"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Delivery &amp; Returns Policy
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-gray-900 uppercase">Hardware Details</span>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5 pt-1">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-semibold text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-mono font-semibold text-gray-900">{product.sku}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-gray-900">{product.category?.name}</span>
                </div>
              </div>

              <div className="p-4 rounded-sm bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-gray-900 uppercase">Compatibility &amp; Safety</span>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5 pt-1">
                  <span className="text-gray-500">Protection</span>
                  <span className="font-semibold text-gray-900">Over-voltage &amp; Thermal Guard</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Warranty</span>
                  <span className="font-semibold text-gray-900">7-Day Replacement Guarantee</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Origin</span>
                  <span className="font-semibold text-gray-900">100% Genuine Retail Pack</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
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
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Frequently Bought Together
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Compatible accessories and companion gear</p>
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

      {/* Sticky Mobile Add-to-Cart Bar */}
      {isStickyBarVisible && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 safe-area-inset-bottom">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {formatPrice(currentPrice)}
              </p>
              <p className="text-xs font-semibold text-gray-700 truncate">
                {selectedVariant?.name || product.name}
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="h-10 px-4 rounded-full text-xs font-bold whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}






