"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductWithDetails } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft, RotateCcw } from "lucide-react";

interface ShopProductGridProps {
  products: ProductWithDetails[];
  totalCount?: number;
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}

export function ShopProductGrid({
  products,
  totalPages,
  currentPage,
  searchParams,
}: ShopProductGridProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithDetails | null>(null);

  const handleQuickView = (product: ProductWithDetails) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-black uppercase tracking-tight text-primary">No accessories match these filters</h3>
          <p className="text-xs font-bold text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting the price slider, switching brands, or resetting all filters.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-2 text-xs font-black uppercase tracking-wider rounded-xl">
          <Link href="/shop" className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> RESET FILTERS
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
          {currentPage > 1 && (
            <Button asChild variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-wider">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...searchParams,
                  page: String(currentPage - 1),
                }).toString()}`}
                className="flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </Link>
            </Button>
          )}

          <span className="text-[10px] font-black px-3 py-1 bg-card border border-border rounded-xl text-primary uppercase font-mono">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages && (
            <Button asChild variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-wider">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...searchParams,
                  page: String(currentPage + 1),
                }).toString()}`}
                className="flex items-center gap-1.5"
              >
                NEXT <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickViewModal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={quickViewProduct} />
      )}
    </>
  );
}
