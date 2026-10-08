import React from "react";
import Link from "next/link";
import { getProducts, getDistinctBrands } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { ShopProductGrid } from "@/components/product/shop-product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ChevronRight as ChevronRightIcon } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    featured?: string;
    sort?: "featured" | "newest" | "price-low-high" | "price-high-low" | "best-selling";
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const category = params.category;
  const brand = params.brand;
  const search = params.search;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const inStock = params.inStock === "true";
  const featured = params.featured === "true";
  const sort = params.sort || "featured";
  const page = parseInt(params.page || "1", 10);

  const [productData, categories, brands] = await Promise.all([
    getProducts({
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort,
      page,
      limit: 15,
    }),
    getCategories(),
    getDistinctBrands(),
  ]);

  const { products, totalCount, totalPages, currentPage } = productData;
  const selectedCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="bg-[#F8F9FA] dark:bg-[#0F1217] min-h-screen pb-16 font-sans">
      {/* Page Header (Nevixra Style Banner) */}
      <div className="bg-white dark:bg-[#15181E] py-10 md:py-16 mb-8 text-center border-b border-gray-100 dark:border-[#262C37]">
        <h1 className="text-3xl md:text-[40px] font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          {selectedCategoryObj ? selectedCategoryObj.name : "Shop All Products"}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-[#8A919C] uppercase tracking-wider">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Shop</Link>
          {selectedCategoryObj && (
            <>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="text-black dark:text-white font-bold">{selectedCategoryObj.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-8">
        {/* Search Banner */}
        {search && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-800 text-sm px-4 py-2 rounded-sm font-semibold">
              <span>Search results for: <strong>&ldquo;{search}&rdquo;</strong></span>
              <Link href="/shop" className="hover:text-black ml-2 underline">Clear</Link>
            </div>
          </div>
        )}

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 sticky top-24">
            <ProductFilters categories={categories} brands={brands} />
          </aside>

          {/* Product Listing */}
          <main className="lg:col-span-3 space-y-8">
            <ShopProductGrid
              products={products}
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={currentPage}
              searchParams={params as Record<string, string | undefined>}
            />
          </main>
        </div>
      </div>
    </div>
  );
}


