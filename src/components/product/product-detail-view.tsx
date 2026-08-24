"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  MapPin,
  Clock,
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
  const [selectedCity, setSelectedCity] = useState("Karachi");

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
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 pb-28 sm:pb-12 text-slate-900 selection:bg-[#FF5500] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link href="/shop" className="hover:text-black transition-colors">
            Catalog
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-black transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="text-slate-950 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Details Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xl shadow-black/3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <ProductGallery images={product.images || []} productName={product.name} />
            </div>

            {/* Product Meta & Buying Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Brand & Rating Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-[#FAF8F5] px-3 py-1 rounded-full border border-stone-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-slate-900 font-black">4.9</span>
                    <span className="text-slate-400 font-medium">(48 reviews)</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  SKU: <span className="text-slate-900 font-bold">{selectedVariant?.sku || product.sku}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight uppercase">
                {product.name}
              </h1>

              {/* Price & Savings Pill */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">
                      {formatPrice(currentPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-base text-slate-400 line-through font-mono font-bold">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-medium">
                    Inclusive of taxes • Cash on Delivery &amp; Bank Transfer Available
                  </span>
                </div>

                {discount > 0 && (
                  <div className="self-start sm:self-auto bg-[#FF5500] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                    SAVE {discount}%
                  </div>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Spec / Color Variant:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === selectedVariantId;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border text-left cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black shadow-md"
                              : "bg-[#FAF8F5] text-slate-800 border-stone-200 hover:border-stone-400 hover:bg-white"
                          }`}
                        >
                          <div className="leading-tight">{variant.name}</div>
                          {variant.price && (
                            <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-stone-300" : "text-slate-500"}`}>
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
              <div className="pt-1">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Currently Out of Stock in Karachi Warehouse</span>
                  </div>
                ) : isLowStock ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                    <Zap className="w-4 h-4 text-[#FF5500] fill-[#FF5500] shrink-0" />
                    <span>Hurry! Only {currentStock} units left in stock</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In Stock — Ready for Express Dispatch Today</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Add to Cart / Buy Now CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-full bg-[#FAF8F5] p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
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
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="flex-1 bg-black hover:bg-[#FF5500] text-white font-bold rounded-full h-12 text-xs shadow-md cursor-pointer transition-all duration-300"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Bag
                  </Button>
                </div>

                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  size="lg"
                  className="w-full bg-[#FF5500] hover:bg-[#e04a00] text-white font-black rounded-full h-12 text-xs shadow-xl shadow-[#FF5500]/25 cursor-pointer uppercase tracking-wider"
                >
                  <Zap className="w-4 h-4 fill-white text-white mr-2" />
                  Instant Checkout — Cash on Delivery
                </Button>
              </div>

              {/* City Delivery Estimator */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF5500]" />
                    <span>Estimated Delivery Timeline:</span>
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="Karachi">Karachi (Same/Next Day)</option>
                    <option value="Lahore">Lahore (1-2 Days)</option>
                    <option value="Islamabad">Islamabad / Rawalpindi (1-2 Days)</option>
                    <option value="Faisalabad">Faisalabad / Multan (2-3 Days)</option>
                    <option value="Nationwide">Other Cities (2-4 Days)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {selectedCity === "Karachi"
                      ? "⚡ Order before 2:00 PM for Same-Day / Next-Day Delivery across Karachi."
                      : `🚚 Estimated arrival in ${selectedCity}: 24 to 48 hours via Express Courier.`}
                  </span>
                </div>
              </div>

              {/* WhatsApp Quick Inquiry Card */}
              <div className="pt-1">
                <a
                  href={whatsAppInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Have questions about this accessory?</div>
                      <div className="text-[11px] text-emerald-700 font-medium">Chat with a Product Specialist on WhatsApp</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <span>Nationwide Express COD</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine Box Pack</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>7-Day Replacement Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Official Distributor Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Overview, Specs, Delivery */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xl shadow-black/3 space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "border-black text-slate-950"
                  : "border-transparent text-slate-400 hover:text-black"
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "specs"
                  ? "border-black text-slate-950"
                  : "border-transparent text-slate-400 hover:text-black"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-2 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "delivery"
                  ? "border-black text-slate-950"
                  : "border-transparent text-slate-400 hover:text-black"
              }`}
            >
              Delivery &amp; Warranty Policy
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 font-normal">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2.5">
                <span className="font-black text-slate-950 uppercase tracking-wider">Hardware Details</span>
                <div className="flex justify-between border-b border-stone-200/80 pb-2 pt-1">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-bold text-slate-900">{product.brand}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/80 pb-2">
                  <span className="text-slate-500">SKU</span>
                  <span className="font-mono font-bold text-slate-900">{product.sku}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Category</span>
                  <span className="font-bold text-slate-900">{product.category?.name}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2.5">
                <span className="font-black text-slate-950 uppercase tracking-wider">Compatibility &amp; Protection</span>
                <div className="flex justify-between border-b border-stone-200/80 pb-2 pt-1">
                  <span className="text-slate-500">Protection Circuit</span>
                  <span className="font-bold text-slate-900">ActiveShield™ Thermal Guard</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/80 pb-2">
                  <span className="text-slate-500">Warranty Coverage</span>
                  <span className="font-bold text-slate-900">7-Day Replacement Guarantee</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Product Authenticity</span>
                  <span className="font-bold text-slate-900">100% Genuine Box Pack</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
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
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                  Frequently Bought Together
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Companion gear and high-speed accessories</p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-slate-900 hover:text-[#FF5500] flex items-center gap-1"
              >
                View Catalog <ChevronRight className="w-3.5 h-3.5" />
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

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Price</span>
          <span className="text-base font-black text-slate-950 font-mono">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="h-10 px-4 bg-black text-white font-bold rounded-full text-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Add
          </Button>

          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="h-10 px-5 bg-[#FF5500] text-white font-black rounded-full text-xs uppercase"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
