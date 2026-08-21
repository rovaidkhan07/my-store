"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { CategoryWithCount } from "@/types";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const featuredCategory = categories[0];
  const secondaryCategories = categories.slice(1, 7);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const tileVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block mb-1">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
              Shop Product by <br className="hidden sm:inline" />Category
            </h2>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-[#FF5500] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <span>View All ({categories.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Main Large Featured Category Bento Card (Left) */}
          {featuredCategory && (
            <motion.div
              variants={tileVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="lg:col-span-6"
            >
              <Link
                href={`/shop?category=${featuredCategory.slug}`}
                className="h-full rounded-3xl bg-white border border-stone-200/90 p-8 flex flex-col justify-between hover:border-[#FF5500]/60 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden block"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full mb-3 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#FF5500]" /> Most Popular
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 group-hover:text-[#FF5500] transition-colors leading-tight">
                    {featuredCategory.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
                    {featuredCategory.description || "Super-fast PD wall chargers, car adapters, and GaN desktop charging stations."}
                  </p>
                </div>

                <div className="relative aspect-16/10 w-full rounded-2xl bg-[#FAF8F5] overflow-hidden my-6 border border-stone-200/60">
                  <Image
                    src={
                      featuredCategory.imageUrl ||
                      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
                    }
                    alt={featuredCategory.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {featuredCategory._count?.products ?? 0} Products Available
                  </span>
                  <div className="w-9 h-9 rounded-full bg-black group-hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Secondary Bento Grid (Right 2x2 Grid) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-2 gap-5">
            {secondaryCategories.slice(0, 4).map((cat) => (
              <motion.div
                key={cat.id}
                variants={tileVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="h-full rounded-3xl bg-white border border-stone-200/90 p-5 flex flex-col justify-between hover:border-[#FF5500]/60 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="relative aspect-square w-full rounded-2xl bg-[#FAF8F5] overflow-hidden mb-3 border border-stone-200/60">
                    <Image
                      src={
                        cat.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400"
                      }
                      alt={cat.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF5500] transition-colors truncate">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium font-mono">
                        {cat._count?.products ?? 0} items
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#FF5500] group-hover:text-white flex items-center justify-center text-slate-700 transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
