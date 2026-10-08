import React from "react";
import { getFeaturedProducts, getProducts } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { HomepageShell } from "@/components/storefront/homepage-shell";
import { ACTIVE_CATEGORIES } from "@/lib/config/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProductsRaw, categories, trendingProductsRaw] = await Promise.all([
    getFeaturedProducts(20),
    getCategories(),
    getProducts({ limit: 20, sort: "best-selling" }),
  ]);

  const activeSlugs = ACTIVE_CATEGORIES.map(c => c.slug);
  
  // Filter products strictly to the active categories
  const featuredProducts = featuredProductsRaw.filter((p: any) => p.category?.slug && activeSlugs.includes(p.category.slug)).slice(0, 8);
  const trendingProducts = trendingProductsRaw.products.filter((p: any) => p.category?.slug && activeSlugs.includes(p.category.slug)).slice(0, 6);

  return (
    <HomepageShell
      featuredProducts={featuredProducts}
      categories={categories}
      trendingProducts={{ products: trendingProducts }}
    />
  );
}
