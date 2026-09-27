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
    <section className="py-14 sm:py-20 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Left Large Orange Highlight Block */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="lg:col-span-4 rounded-3xl bg-accent text-accent-foreground p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-accent/15 relative overflow-hidden group"
          >
            {/* Ambient Animated Circle */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white blur-2xl pointer-events-none"
            />

            <div className="relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-accent-foreground/80 block mb-2">
                Hot Selling in Pakistan
              </span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-tight">
                OUR TRENDING <br />PRODUCTS
              </h2>
              <p className="text-xs sm:text-sm text-accent-foreground/90 mt-3 leading-relaxed font-bold">
                Transform your everyday mobile interactions into extraordinary experiences with our most sought-after accessories.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/shop?sort=best-selling"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-wide hover:bg-white hover:text-primary transition-all shadow-md group/btn"
                >
                  <span>BROWSE BEST SELLERS</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 group-hover/btn:bg-primary/10 flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3 text-primary-foreground group-hover/btn:text-primary" />
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
                  className="rounded-3xl bg-card border border-border p-5 flex flex-col justify-between hover:border-accent hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group"
                >
                  <div>
                    {/* Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-square w-full rounded-2xl bg-secondary overflow-hidden mb-4 block border border-border/50"
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
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider line-clamp-1">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-[11px] font-black">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>5.0</span>
                        </div>
                        <span className="text-muted-foreground font-bold text-[9px]">({"{{REVIEW_COUNT}}"})</span>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-black text-primary uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>

                  {/* Pricing & Add To Cart Button */}
                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                    <div className="font-black text-sm text-primary font-mono">
                      {formatPrice(product.salePrice || product.price)}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuickAdd(product)}
                      className={`h-8 px-4 rounded-full text-[10px] uppercase tracking-wider font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                        isAdded
                          ? "bg-success text-success-foreground shadow-success/30"
                          : "bg-primary hover:bg-accent text-primary-foreground"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <span>ADD TO CART</span>
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
