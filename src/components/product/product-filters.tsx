"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Check, Sparkles } from "lucide-react";

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
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-slate-300 bg-white font-bold text-xs"
        >
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Products {hasActiveFilters && "• (Active)"}</span>
        </Button>

        {/* Sort selector in mobile bar */}
        <select
          value={currentSort}
          onChange={(e) => applyFilters({ sort: e.target.value })}
          className="h-11 px-3 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-800 outline-none"
        >
          <option value="featured">Sort: Featured</option>
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
        } lg:block bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6`}
      >
        {/* Header with Clear Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-black text-slate-950 text-sm uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" /> Filter Catalog
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Sort Options (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Sort Order
          </label>
          <select
            value={currentSort}
            onChange={(e) => applyFilters({ sort: e.target.value })}
            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white outline-none focus:border-blue-600"
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
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Category
          </label>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => applyFilters({ category: null })}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                !currentCategory
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20"
                  : "text-slate-700 hover:bg-slate-50"
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20"
                      : "text-slate-700 hover:bg-slate-50"
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
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Popular Brands
            </label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => {
                const isSelected = currentBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => applyFilters({ brand: isSelected ? null : b })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Price Range (PKR)
          </label>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Rs."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none focus:border-blue-600 font-mono"
              />
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="w-full text-xs font-bold rounded-xl h-9">
              Apply Price Filter
            </Button>
          </form>
        </div>

        {/* Availability Toggle */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 select-none">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) => applyFilters({ inStock: e.target.checked ? "true" : null })}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>Show In-Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
