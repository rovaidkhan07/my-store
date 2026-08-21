"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { ArrowUpRight, Star, Check } from "lucide-react";

interface TrendingSectionProps {
  products: ProductWithDetails[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

export function TrendingSection({ products }: TrendingSectionProps) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: ProductWithDetails) => {
    addItem(product, product.variants?.[0]?.id || null, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const trendingList = products.slice(0, 3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Left Large Orange Highlight Block (R&Z Style) with Interactive Glow */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="lg:col-span-4 rounded-3xl bg-[#FF5500] text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-[#FF5500]/15 relative overflow-hidden group"
          >
            {/* Ambient Animated Circle */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white blur-2xl pointer-events-none"
            />

            <div className="relative z-10">
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

            <div className="pt-8 relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/shop?sort=best-selling"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-950 font-black text-xs hover:bg-slate-950 hover:text-white transition-all shadow-md group/btn"
                >
                  <span>Browse Best Sellers</span>
                  <div className="w-5 h-5 rounded-full bg-stone-100 group-hover/btn:bg-white/20 flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3 text-slate-950 group-hover/btn:text-white" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Product Cards List */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {trendingList.map((product) => {
              const image =
                product.images?.[0]?.imageUrl || FALLBACK_IMAGE;
              const isAdded = addedId === product.id;

              return (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="rounded-3xl bg-[#FAF6F0] border border-stone-200/90 p-5 flex flex-col justify-between hover:border-[#FF5500]/60 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group"
                >
                  <div>
                    {/* Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-square w-full rounded-2xl bg-white overflow-hidden mb-4 block border border-stone-200/60"
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

                  {/* Pricing & Add To Cart Button */}
                  <div className="pt-4 mt-4 border-t border-stone-200/60 flex items-center justify-between gap-2">
                    <div className="font-black text-sm text-slate-950 font-mono">
                      {formatPrice(product.salePrice || product.price)}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuickAdd(product)}
                      className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                        isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
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
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
