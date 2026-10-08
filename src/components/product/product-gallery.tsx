"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductImage } from "@/generated/prisma/client";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const defaultImage = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80";
  const displayImages = images && images.length > 0 ? images : [{ id: "def", imageUrl: defaultImage, altText: productName, sortOrder: 0, productId: "", createdAt: new Date() }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = displayImages[activeIndex] || displayImages[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, displayImages.length]);

  const openLightbox = () => {
    setIsZoomed(false);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full rounded-2xl bg-white dark:bg-[#15181E] border border-slate-200 overflow-hidden shadow-xs">
          <Image
            src={activeImage.imageUrl}
            alt={activeImage.altText || productName}
            fill
            priority
            sizes={isZoomed ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 50vw"}
            className={`object-contain p-4 transition-all duration-300 cursor-zoom-in ${isZoomed ? "scale-150 cursor-zoom-out" : ""}`}
            onClick={openLightbox}
          />

          {/* Zoom Button Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isZoomed) setIsZoomed(false);
              else setIsZoomed(true);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white dark:bg-[#15181E] shadow-md transition-all cursor-pointer"
            aria-label={isZoomed ? "Exit zoom" : "Zoom in"}
          >
            <Search className="w-4 h-4 text-slate-700" />
          </button>

          {/* Lightbox Expand Button */}
          <button
            onClick={openLightbox}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white dark:bg-[#15181E] shadow-md transition-all cursor-pointer"
            aria-label="Open fullscreen"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {displayImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-20 h-20 rounded-xl bg-white dark:bg-[#15181E] border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Product image zoom"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>

          {displayImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
              }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={activeImage.imageUrl}
              alt={activeImage.altText || productName}
              width={1200}
              height={1200}
              className="object-contain"
            />
          </div>

          {displayImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail strip in lightbox */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pb-4">
              {displayImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeIndex === idx
                      ? "border-primary opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-75"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt=""
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

