"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductWithDetails } from "@/types";

interface TrendingSectionProps {
  products: ProductWithDetails[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const displayedProducts = products.slice(0, 4);

  if (!displayedProducts || displayedProducts.length === 0) return null;

  return (
    <section className="w-full bg-white dark:bg-[#15181E] font-sans py-16">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">

        {/* Header Section (Nevixra Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#15181E] rounded-full text-[11px] font-bold text-gray-800 dark:text-[#D5D9E0] shadow-sm mb-4 border border-gray-100 dark:border-[#262C37]">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Our Product
            </div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A1A1A] tracking-tight leading-none">
              Browse Our wide Product Range
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-sm text-[13px] font-semibold hover:bg-black transition-colors shrink-0"
          >
            Shop Now <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
