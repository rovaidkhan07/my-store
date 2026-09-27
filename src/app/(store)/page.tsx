import React from "react";
import { getFeaturedProducts, getProducts } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { HomepageShell } from "@/components/storefront/homepage-shell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories, trendingProducts] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getProducts({ limit: 6, sort: "best-selling" }),
  ]);

  return (
    <HomepageShell
      featuredProducts={featuredProducts}
      categories={categories}
      trendingProducts={trendingProducts}
    />
  );
}