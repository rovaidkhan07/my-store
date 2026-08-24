import React from "react";
import Link from "next/link";
import { getProducts, getDistinctBrands } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft, ChevronRight, RotateCcw, ChevronRight as ChevronRightIcon } from "lucide-react";

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
      limit: 16,
    }),
    getCategories(),
    getDistinctBrands(),
  ]);

  const { products, totalCount, totalPages, currentPage } = productData;
  const selectedCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 text-slate-900 selection:bg-[#FF5500] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Page Header & Breadcrumbs */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold">Catalog</span>
            {selectedCategoryObj && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="text-[#FF5500] font-bold">{selectedCategoryObj.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
                {selectedCategoryObj ? selectedCategoryObj.name : "All Mobile Accessories"}
              </h1>
              {selectedCategoryObj?.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                  {selectedCategoryObj.description}
                </p>
              )}
            </div>
            <span className="text-xs font-bold text-slate-500 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-stone-200 self-start sm:self-auto font-mono">
              {totalCount} products found
            </span>
          </div>

          {search && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-1.5 rounded-full">
              <span>Search query: <strong>&ldquo;{search}&rdquo;</strong></span>
              <Link href="/shop" className="hover:text-black font-bold ml-2">✕ Clear</Link>
            </div>
          )}
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 sticky top-24 z-20">
            <ProductFilters categories={categories} brands={brands} />
          </aside>

          {/* Product Listing Grid */}
          <main className="lg:col-span-9 space-y-8">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-10 sm:p-14 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">No accessories match these filters</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                    Try adjusting the price slider, switching brands, or resetting all filters.
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-2 text-xs font-bold rounded-full border-stone-200">
                  <Link href="/shop" className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* 2-column mobile, 3-column desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6 border-t border-stone-200">
                    {currentPage > 1 && (
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-stone-200 bg-white">
                        <Link
                          href={`/shop?${new URLSearchParams({
                            ...(params as any),
                            page: String(currentPage - 1),
                          }).toString()}`}
                          className="flex items-center gap-1.5"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </Link>
                      </Button>
                    )}

                    <span className="text-xs font-bold px-4 py-1.5 bg-white border border-stone-200 rounded-full text-slate-800 font-mono">
                      {currentPage} / {totalPages}
                    </span>

                    {currentPage < totalPages && (
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-stone-200 bg-white">
                        <Link
                          href={`/shop?${new URLSearchParams({
                            ...(params as any),
                            page: String(currentPage + 1),
                          }).toString()}`}
                          className="flex items-center gap-1.5"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
