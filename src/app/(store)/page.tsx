import React from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { TrendingSection } from "@/components/storefront/trending-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { TechFeaturesSection } from "@/components/storefront/tech-features-section";
import { CustomerReviews } from "@/components/storefront/customer-reviews";
import { VipBanner } from "@/components/storefront/vip-banner";
import { TrustFeatures } from "@/components/storefront/trust-features";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts, getProducts } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories, trendingProducts] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getProducts({ limit: 6, sort: "best-selling" }),
  ]);

  return (
    <div className="space-y-0 bg-[#FAF8F5]">
      {/* 1. Hero Section (Dexo / R&Z Style) */}
      <HeroBanner />

      {/* 2. Trending Products Strip (R&Z Style Orange Highlight Block) */}
      <TrendingSection products={trendingProducts.products} />

      {/* 3. Shop by Category Bento Grid (R&Z Style) */}
      <CategoryGrid categories={categories} />

      {/* 4. Engineering Excellence Dark Section (Dexo Style) */}
      <TechFeaturesSection />

      {/* 5. Signature Products Grid (Dexo Style "Explore Our Signature Products") */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block mb-1">
                Handpicked Collections
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
                Explore Our <br className="hidden sm:inline" />Signature Products
              </h2>
            </div>
            <Link
              href="/shop?featured=true"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-[#FF5500] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <span>View All Featured</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
