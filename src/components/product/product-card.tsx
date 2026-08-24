"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProductWithDetails } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Star, Check, ArrowUpRight, Zap, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: ProductWithDetails;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  const [imgSrc, setImgSrc] = useState(
    product.images && product.images.length > 0 && product.images[0].imageUrl
      ? product.images[0].imageUrl
      : FALLBACK_IMAGE
  );

  const discount = product.salePrice
    ? calculateDiscountPercentage(product.price, product.salePrice)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;
  const isGaN = product.name.toLowerCase().includes("gan") || product.description?.toLowerCase().includes("gan");

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const variantId = product.variants?.[activeVariantIndex]?.id || null;
    addItem(product, variantId, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-3xl border border-stone-200/90 hover:border-black/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/6 flex flex-col justify-between"
    >
      <div>
        {/* Image Container with Badges */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-square w-full rounded-2xl bg-[#FAF8F5] overflow-hidden mb-3.5 block border border-stone-200/60 group-hover:border-stone-300 transition-colors"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="object-contain p-3.5 group-hover:scale-108 transition-transform duration-500"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="bg-[#FF5500] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#FF5500]" /> Hot
              </span>
            )}
            {isGaN && (
              <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> GaN III
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-black text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Brand, Variants & Rating Label */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {product.brand}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-950 line-clamp-2 min-h-[2.5rem] group-hover:text-[#FF5500] transition-colors leading-snug">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Variant Swatches (if available) */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-slate-400 font-medium mr-1">Options:</span>
            {product.variants.slice(0, 3).map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveVariantIndex(idx);
                }}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  activeVariantIndex === idx
                    ? "bg-black text-white border-black"
                    : "bg-[#FAF8F5] text-slate-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Add To Cart Button */}
      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-black text-slate-950 font-mono">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-[10px] text-slate-400 line-through font-mono">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`h-9 px-4 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isAdded
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
              : "bg-black hover:bg-[#FF5500] text-white"
          }`}
          title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <span>Add</span>
              <ArrowUpRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
