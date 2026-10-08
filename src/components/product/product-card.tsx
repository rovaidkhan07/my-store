"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductWithDetails;
  onQuickView?: (product: ProductWithDetails) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images.length > 0 && product.images[0].imageUrl
      ? product.images[0].imageUrl
      : FALLBACK_IMAGE
  );

  const isOutOfStock = product.stockQuantity <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    addItem(product, product.variants?.[0]?.id || null, 1);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }, 450);
  };

  return (
    <div className="bg-white dark:bg-[#15181E] border border-gray-100 dark:border-[#262C37] overflow-hidden flex flex-col group h-full transition-shadow hover:shadow-lg font-sans relative">

      {/* Image Container (Light Grey) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-secondary dark:bg-[#1C2028] block group-hover:opacity-90 transition-opacity"
      >
        {/* Red Sale Tag */}
        {product.salePrice && (
          <div className="absolute top-0 left-0 z-10 bg-[#FF4747] text-white text-xs font-bold px-3 py-1 rounded-br-md shadow-sm uppercase tracking-wide">
            Sale
          </div>
        )}
        
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Area (White) */}
      <div className="p-4 flex flex-col flex-1 bg-white dark:bg-[#15181E]">
        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3 min-h-[60px] mb-2 group-hover:text-black dark:group-hover:text-primary transition-colors" title={product.name}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex items-center gap-2 mb-4">
          <span className="text-[16px] font-bold text-gray-900 dark:text-[#E9EBEF]">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Premium Add To Cart Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock || isAdding}
          className={`w-full py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300 mt-auto flex items-center justify-center gap-2 rounded-b-xl
            ${isOutOfStock
              ? "bg-gray-100 dark:bg-[#1C2028] text-gray-400 cursor-not-allowed"
              : isAdded
              ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
              : "bg-gradient-to-r from-primary to-accent text-white hover:from-accent hover:to-[#c2410c] hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98]"
            }`}
        >
          {isAdding ? (
            <><Spinner /> Adding...</>
          ) : isAdded ? (
            <><Check className="w-4 h-4" /> Added To Cart</>
          ) : isOutOfStock ? (
            "Unavailable"
          ) : (
            <><ShoppingCart className="w-4 h-4" /> Add To Cart</>
          )}
        </button>
      </div>

    </div>
  );
}




