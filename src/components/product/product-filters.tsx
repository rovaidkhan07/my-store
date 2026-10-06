"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Check, ChevronDown } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSearch = searchParams.get("search") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const applyFilters = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page to 1 on filter change
    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: minPrice ? minPrice : null,
      maxPrice: maxPrice ? maxPrice : null,
    });
  };

  const handleResetAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop");
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentBrand ||
      currentInStock ||
      currentMinPrice ||
      currentMaxPrice ||
      currentSearch ||
      (currentSort && currentSort !== "featured")
  );

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button Bar */}
      <div className="lg:hidden flex items-center justify-between gap-2.5 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border-stone-200 bg-white font-bold text-xs shadow-2xs cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Filters {hasActiveFilters && "• (Active)"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpenMobile ? "rotate-180" : ""}`} />
        </Button>

        {/* Sort selector in mobile bar */}
        <select
          value={currentSort}
          onChange={(e) => applyFilters({ sort: e.target.value })}
          className="h-11 px-3.5 bg-white border border-stone-200 rounded-full text-xs font-bold text-slate-850 outline-none shadow-2xs cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="best-selling">Best Selling</option>
        </select>
      </div>

      {/* Filter Content Container */}
      <div
        className={`${
          isOpenMobile ? "block" : "hidden"
        } lg:block bg-white p-6 rounded-sm border border-stone-200/90 shadow-sm space-y-6`}
      >
        {/* Header with Clear Button */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5500]" /> Filter Gear
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              className="text-xs text-[#FF5500] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Sort Options (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Sort Order
          </label>
          <select
            value={currentSort}
            onChange={(e) => applyFilters({ sort: e.target.value })}
            className="w-full h-10 px-3 bg-[#FAF8F5] border border-stone-200 rounded-sm text-xs font-semibold text-gray-900 focus:bg-white outline-none focus:border-black cursor-pointer"
          >
            <option value="featured">Featured Items</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        {/* Categories Filter */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Category
          </label>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => applyFilters({ category: null })}
              className={`w-full text-left px-3 py-2 rounded-sm text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                !currentCategory
                  ? "bg-black text-white font-bold shadow-xs"
                  : "text-gray-700 hover:bg-[#FAF8F5]"
              }`}
            >
              <span>All Categories</span>
              {!currentCategory && <Check className="w-3.5 h-3.5" />}
            </button>

            {categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => applyFilters({ category: isSelected ? null : cat.slug })}
                  className={`w-full text-left px-3 py-2 rounded-sm text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-black text-white font-bold shadow-xs"
                      : "text-gray-700 hover:bg-[#FAF8F5]"
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands Filter */}
        {brands.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-stone-100">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Popular Brands
            </label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => {
                const isSelected = currentBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => applyFilters({ brand: isSelected ? null : b })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black shadow-xs"
                        : "bg-[#FAF8F5] text-gray-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="space-y-2.5 pt-4 border-t border-stone-100">
          <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Price Range (PKR)
          </label>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Rs."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#FAF8F5] border border-stone-200 rounded-sm focus:bg-white outline-none focus:border-black font-mono"
              />
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#FAF8F5] border border-stone-200 rounded-sm focus:bg-white outline-none focus:border-black font-mono"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full text-xs font-bold rounded-full h-9 bg-black hover:bg-[#FF5500] text-white cursor-pointer"
            >
              Apply Filter
            </Button>
          </form>
        </div>

        {/* Availability Toggle */}
        <div className="pt-4 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 select-none">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) => applyFilters({ inStock: e.target.checked ? "true" : null })}
              className="w-4 h-4 rounded text-black border-stone-300 focus:ring-black accent-black"
            />
            <span>Show In-Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}

