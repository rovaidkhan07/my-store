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
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header & Breadcrumbs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Catalog</span>
            {selectedCategoryObj && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-600 font-bold">{selectedCategoryObj.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {selectedCategoryObj ? selectedCategoryObj.name : "All Mobile Accessories"}
              </h1>
              {selectedCategoryObj?.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  {selectedCategoryObj.description}
                </p>
              )}
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-mono">
              {totalCount} products found
            </span>
          </div>

          {search && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3.5 py-1.5 rounded-xl">
              <span>Matching search: <strong>&ldquo;{search}&rdquo;</strong></span>
              <Link href="/shop" className="hover:text-blue-950 font-bold ml-2">✕ Clear</Link>
            </div>
          )}
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 sticky top-24">
            <ProductFilters categories={categories} brands={brands} />
          </aside>

          {/* Product Listing */}
          <main className="lg:col-span-9 space-y-8">
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
