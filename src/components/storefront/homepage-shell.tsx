"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { TrendingSection } from "@/components/storefront/trending-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { TechFeaturesSection } from "@/components/storefront/tech-features-section";
import { CustomerReviews } from "@/components/storefront/customer-reviews";
import { VipBanner } from "@/components/storefront/vip-banner";
import { TrustFeatures } from "@/components/storefront/trust-features";
import { ProductCard } from "@/components/product/product-card";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ProductGridSkeleton, CategoryGridSkeleton } from "@/components/ui/product-grid-skeleton";

interface HomepageShellProps {
  featuredProducts: ProductWithDetails[];
  categories: Category[];
  trendingProducts: { products: ProductWithDetails[] };
}

export function HomepageShell({
  featuredProducts,
  categories,
  trendingProducts,
}: HomepageShellProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-0 bg-[#FAF8F5] dark:bg-[#0F1115]">
        {/* Hero Skeleton */}
        <section className="bg-white dark:bg-[#15181E] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-6">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1 space-y-4">
                <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-10 sm:h-14 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 sm:h-14 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 w-40 bg-slate-200 rounded-full animate-pulse" />
              </div>
              <div className="w-full lg:w-1/2 aspect-video bg-slate-200 rounded-3xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Trending Skeleton */}
        <section className="bg-white dark:bg-[#15181E] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-8 w-52 bg-slate-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-10 w-36 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-slate-100 rounded-3xl p-4 space-y-3">
                  <div className="aspect-square rounded-2xl bg-slate-200 animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-8 w-full bg-slate-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Skeleton */}
        <section className="bg-[#FAF8F5] dark:bg-[#0F1115]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <CategoryGridSkeleton />
            </div>
          </div>
        </section>

        {/* Signature Products Skeleton */}
        <section className="bg-white dark:bg-[#15181E] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <ProductGridSkeleton count={4} />
            </div>
          </div>
        </section>

        {/* Reviews Skeleton */}
        <section className="bg-[#FAF8F5] dark:bg-[#0F1115]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 p-6 space-y-4">
                  <div className="h-4 w-1/2 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-3 w-full bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-3 w-3/4 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-0 bg-[#FAF8F5] dark:bg-[#0F1115]">
      {/* 1. Hero Section (Dexo / R&Z Style) */}
      <HeroBanner />

      {/* 2. Trending Products Strip (R&Z Style Orange Highlight Block) */}
      <TrendingSection products={trendingProducts.products} />

      {/* 3. Shop by Category Bento Grid (R&Z Style) */}
      <CategoryGrid categories={categories} />

      {/* 4. Engineering Excellence Dark Section (Dexo Style) */}
      <TechFeaturesSection />

      {/* 5. Signature Products Grid (Dexo Style "Explore Our Signature Products") */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#15181E] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-widest text-primary block mb-1">
                Handpicked Collections
              </span>
              <h2 className="text-3xl sm:text-4xl font-black capitalize tracking-tight text-slate-950 dark:text-white">
                Explore Our <br className="hidden sm:inline" />Signature Products
              </h2>
            </div>
            <Link
              href="/shop?featured=true"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-primary text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <span>View All Featured</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-4 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 pb-4 sm:pb-0">
            {featuredProducts.map((product) => (
              <div key={product.id} className="min-w-[240px] sm:min-w-0 w-[240px] sm:w-full snap-start shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Voices & Reviews (Dexo Style) */}
      <CustomerReviews />

      {/* 7. VIP Newsletter Banner (Dexo Style) */}
      <VipBanner />

      {/* 8. Trust Highlights */}
      <TrustFeatures />
    </div>
  );
}



