"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/generated/prisma/client";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const defaultImage = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80";
  const displayImages = images && images.length > 0 ? images : [{ id: "def", imageUrl: defaultImage, altText: productName, sortOrder: 0, productId: "", createdAt: new Date() }];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <Image
          src={activeImage.imageUrl}
          alt={activeImage.altText || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-xl bg-white border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                activeIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
