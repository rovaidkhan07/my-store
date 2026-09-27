"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

export function HeroBanner() {
  const [selectedPreview, setSelectedPreview] = useState(0);

  const heroPreviews = [
    {
      title: "Anker Soundcore Space One ANC",
      category: "Wireless Audio",
      price: "Rs. 18,999",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      alt: "ANC Wireless Headphones",
      link: "/shop?category=audio",
      highlight: "Hi-Res LDAC Audio • 2X Voice Reduction",
    },
    {
      title: "Anker 735 65W GaN III Fast Charger",
      category: "HyperCharge Tech",
      price: "Rs. 6,499",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      alt: "65W GaN Charger",
      link: "/shop?category=chargers",
      highlight: "3-Port Fast Charge • 40% Smaller",
    },
  ];

  const current = heroPreviews[selectedPreview];

  // Stagger Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
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
    <section className="relative overflow-hidden bg-background pt-8 pb-16 sm:pb-24 border-b border-border">
      {/* Ambient Breathing Gradient Light Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-12 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 to-amber-300/15 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Right Support Strip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-30 bg-card/90 backdrop-blur-md p-2 rounded-full border border-border shadow-xl text-primary"
        >
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/shop?category=chargers"
              className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors text-xs font-bold"
              title="Fast Chargers"
            >
              ⚡
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/shop?category=audio"
              className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors text-xs font-bold"
              title="Wireless Audio"
            >
              🎧
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/track-order"
              className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors text-xs font-bold"
              title="Track Order"
            >
              🚚
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Eyebrow Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-2xs text-xs font-black uppercase tracking-wide text-primary">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>SOURCED FROM TRUSTED SUPPLIERS</span>
              </div>
            </motion.div>

            {/* Editorial Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-primary uppercase leading-[1.04]"
            >
              ELEVATE YOUR <br />
              <span className="text-accent inline-block">
                MOBILE
              </span>{" "}
              EXPERIENCE.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed"
            >
              Transform your everyday mobile charging, audio, and device protection with quality-checked GaN chargers, durable braided cables, and precision cases.
            </motion.p>

            {/* CTA Pill Buttons & Reviews */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary hover:bg-accent text-primary-foreground font-black text-sm uppercase tracking-wide transition-all duration-300 shadow-xl shadow-black/10 group"
                >
                  <span>EXPLORE STORE</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/shop?category=chargers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card hover:bg-secondary text-primary border border-border font-black text-sm uppercase tracking-wide transition-colors shadow-2xs"
                >
                  <Zap className="w-4 h-4 text-accent" /> FAST CHARGERS
                </Link>
              </motion.div>
            </motion.div>

            {/* Customer Rating Proof Badge */}
            <motion.div
              variants={itemVariants}
              className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs"
            >
              <div className="flex -space-x-1.5">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ★
                </div>
                <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ⚡
                </div>
                <div className="w-7 h-7 rounded-full bg-success text-success-foreground flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ✓
                </div>
              </div>
              <div className="text-muted-foreground font-medium">
                <strong className="text-primary font-black uppercase">TOP RATED</strong> based on {"{{REVIEW_COUNT}}"} reviews across Pakistan
              </div>
            </motion.div>

            {/* Bottom mini preview switcher cards */}
            <motion.div variants={itemVariants} className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {heroPreviews.map((preview, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedPreview(idx)}
                  className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    selectedPreview === idx
                      ? "bg-card border-primary shadow-md"
                      : "bg-card/60 border-border/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-xl bg-secondary overflow-hidden shrink-0">
                    <Image src={preview.image} alt={preview.title} fill className="object-cover" />
                  </div>
                  <div className="text-[11px] pr-2">
                    <div className="font-bold text-primary line-clamp-1">{preview.category}</div>
                    <div className="text-accent font-black font-mono">{preview.price}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background organic contour ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-border pointer-events-none scale-110"
            />

            {/* Floating Showcase Card */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-sm aspect-4/5 rounded-3xl bg-card p-6 sm:p-7 border border-border shadow-2xl flex flex-col justify-between group"
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" /> TOP PICK
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">QUALITY CHECKED</span>
              </div>

              {/* Main Image with AnimatePresence crossfade */}
              <div className="relative aspect-square w-full my-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={current.image}
                      alt={current.alt}
                      fill
                      priority
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Card Meta & Quick Link */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-primary uppercase tracking-tight line-clamp-1">
                    {current.title}
                  </h3>
                  <div className="text-[11px] text-muted-foreground font-bold">{current.highlight}</div>
                  <div className="text-sm font-black text-accent font-mono mt-0.5">
                    {current.price}
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href={current.link}
                    className="w-10 h-10 rounded-full bg-primary hover:bg-accent text-primary-foreground flex items-center justify-center transition-colors shadow-md shrink-0"
                    aria-label="View Product"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
