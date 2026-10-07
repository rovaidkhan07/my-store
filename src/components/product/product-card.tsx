"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: ProductWithDetails;
  onQuickView?: (product: ProductWithDetails) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images.length > 0 && product.images[0].imageUrl
      ? product.images[0].imageUrl
      : FALLBACK_IMAGE
  );

  const isOutOfStock = product.stockQuantity <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem(product, product.variants?.[0]?.id || null, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-100 overflow-hidden flex flex-col group h-full transition-shadow hover:shadow-lg font-sans relative">

      {/* Image Container (Light Grey) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F5F7] block group-hover:opacity-90 transition-opacity"
      >
        {/* Red Sale Tag */}
        {product.salePrice && (
          <div className="absolute top-0 left-0 z-10 bg-[#FF4747] text-white text-[11px] font-bold px-3 py-1 rounded-br-md shadow-sm uppercase tracking-wide">
            Sale
          </div>
        )}
        
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
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
      <div className="p-4 flex flex-col flex-1 bg-white">
        {/* Product Title */}
        <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 h-[42px] mb-2 group-hover:text-black transition-colors" title={product.name}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex items-center gap-2 mb-4">
          <span className="text-[16px] font-bold text-gray-900">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-[14px] text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Flush Black Add To Cart Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-3 text-[13px] font-semibold transition-colors mt-auto
            ${isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isAdded
              ? "bg-green-600 text-white"
              : "bg-[#f97316] text-white hover:bg-[#ea580c]"
            }`}
        >
          {isAdded ? "Added To Cart" : isOutOfStock ? "Unavailable" : "Add To Cart"}
        </button>
      </div>

    </div>
  );
}

