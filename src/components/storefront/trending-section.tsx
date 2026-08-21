"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { ArrowUpRight, Star, ShoppingBag, Check } from "lucide-react";

interface TrendingSectionProps {
  products: ProductWithDetails[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleQuickAdd = (product: ProductWithDetails) => {
    addItem(product, product.variants?.[0]?.id || null, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const trendingList = products.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Large Orange Highlight Block (R&Z Style) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#FF5500] text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-[#FF5500]/15 relative overflow-hidden group">
            {/* Ambient Background Circle */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block mb-2">
                Hot Selling in Pakistan
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                Our Trending <br />Products
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-3 leading-relaxed font-medium">
                Transform your everyday mobile interactions into extraordinary experiences with our best-rated accessories.
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/shop?sort=best-selling"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-950 font-black text-xs hover:bg-slate-950 hover:text-white transition-all shadow-md group/btn"
              >
                <span>Browse Best Sellers</span>
                <div className="w-5 h-5 rounded-full bg-slate-100 group-hover/btn:bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-slate-950 group-hover/btn:text-white" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Product Cards List (R&Z Style) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {trendingList.map((product) => {
              const image =
                product.images?.[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400";
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-[#FAF8F5] border border-slate-200/90 p-5 flex flex-col justify-between hover:border-[#FF5500]/60 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group"
                >
                  <div>
                    {/* Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-square w-full rounded-2xl bg-white overflow-hidden mb-4 block border border-slate-100"
                    >
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Meta */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>5.0</span>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#FF5500] transition-colors">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>

                  {/* Pricing & Add To Cart Button (R&Z Orange Pill Style) */}
                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="font-black text-sm text-slate-950 font-mono">
                      {formatPrice(product.salePrice || product.price)}
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#FF5500] hover:bg-slate-950 text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add To Cart</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
