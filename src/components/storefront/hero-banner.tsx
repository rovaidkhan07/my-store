"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowUpRight,
  Star,
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  Flame,
  CheckCircle2,
  Layers,
} from "lucide-react";

export function HeroBanner() {
  const [selectedPreview, setSelectedPreview] = useState(0);

  const heroPreviews = [
    {
      title: "Anker 735 GaNPrime 65W Fast Charger",
      category: "GaN HyperCharge",
      price: "Rs. 6,499",
      oldPrice: "Rs. 7,999",
      discount: "19% OFF",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      alt: "65W GaN Charger",
      link: "/shop?category=chargers",
      tag: "FLAGSHIP GAN III",
      specs: ["65W Max Output", "3-Port Fast Charge", "ActiveShield 2.0"],
      color: "#FF5500",
    },
    {
      title: "Soundcore Space One ANC Headphones",
      category: "Hi-Res Wireless Audio",
      price: "Rs. 18,999",
      oldPrice: "Rs. 22,999",
      discount: "17% OFF",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      alt: "ANC Wireless Headphones",
      link: "/shop?category=audio",
      tag: "HI-RES LDAC AUDIO",
      specs: ["2X Voice Reduction", "55-Hour Battery", "LDAC Bluetooth 5.3"],
      color: "#0A0D14",
    },
    {
      title: "PowerLine III Flow 100W USB-C Cable",
      category: "Braided Armor Cable",
      price: "Rs. 1,999",
      oldPrice: "Rs. 2,499",
      discount: "20% OFF",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      alt: "100W Fast Charging Cable",
      link: "/shop?category=cables",
      tag: "100W PD 5A FAST CHARGE",
      specs: ["100W Power Delivery", "25,000+ Bend Lifespan", "Silicone Soft Touch"],
      color: "#10B981",
    },
  ];

  const current = heroPreviews[selectedPreview];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 sm:pt-10 pb-16 sm:pb-24 border-b border-stone-200/80">
      {/* Ambient Breathing Gradient Light Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-8 right-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-[#FF5500]/15 to-amber-300/15 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Micro Live Proof Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center lg:justify-start gap-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
            <Flame className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Over 1,200+ Verified Orders Dispatched This Week Across Pakistan</span>
          </div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Eyebrow Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Official Luxury Tech Gear</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 font-normal">Anker • Baseus • Soundcore</span>
              </div>
            </motion.div>

            {/* Editorial Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-950 uppercase leading-[1.05] break-words"
            >
              ELEVATE YOUR <br />
              <span className="text-[#FF5500] inline-block">
                MOBILE
              </span>{" "}
              EXPERIENCE.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Transform your everyday charging, audio, and device protection with certified high-speed GaN chargers, durable braided 100W cables, and precision-engineered acoustics.
            </motion.p>

            {/* CTA Pill Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-black hover:bg-[#FF5500] text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-[#FF5500]/25 group"
                >
                  <span>Explore Full Catalog</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/shop?category=chargers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-white hover:bg-stone-100 text-slate-900 border border-stone-200 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <Zap className="w-4 h-4 text-[#FF5500]" /> Fast Chargers (GaN)
                </Link>
              </motion.div>
            </motion.div>

            {/* Customer Rating Proof Badge */}
            <motion.div
              variants={itemVariants}
              className="pt-2 flex items-center justify-center lg:justify-start gap-2.5 text-xs"
            >
              <div className="flex -space-x-1.5 shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ★
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FF5500] text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ⚡
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  ✓
                </div>
              </div>
              <div className="text-slate-600 font-medium text-[11px] sm:text-xs">
                <strong className="text-slate-950 font-bold">4.9/5.0 Rating</strong> from 15,000+ verified buyers
              </div>
            </motion.div>

            {/* Interactive 3-way Flagship Switchers (Horizontally Scrollable on Mobile) */}
            <motion.div variants={itemVariants} className="pt-3 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center lg:text-left">
                Featured Flagships:
              </div>
              <div className="flex items-center justify-start lg:justify-start gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {heroPreviews.map((preview, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedPreview(idx)}
                    className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl border text-left transition-all cursor-pointer shrink-0 ${
                      selectedPreview === idx
                        ? "bg-white border-black shadow-md ring-2 ring-black/5"
                        : "bg-white/70 border-stone-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <Image src={preview.image} alt={preview.title} fill className="object-cover" />
                    </div>
                    <div className="text-[11px] pr-1">
                      <div className="font-bold text-slate-900 line-clamp-1">{preview.category}</div>
                      <div className="text-[#FF5500] font-black font-mono">{preview.price}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background organic contour ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-stone-300/70 pointer-events-none scale-110"
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
              className="relative w-full max-w-sm aspect-4/5 rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-2xl flex flex-col justify-between group"
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF5500]" /> {current.tag}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {current.discount}
                </span>
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
                    className="relative w-full h-full flex items-center justify-center"
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

              {/* Live Specs Pills inside Card */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {current.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold text-slate-700 bg-[#FAF8F5] border border-stone-200 px-2.5 py-0.5 rounded-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Bottom Card Meta & Quick Link */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-950 line-clamp-1">
                    {current.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-base font-black text-[#FF5500] font-mono">
                      {current.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-mono">
                      {current.oldPrice}
                    </span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href={current.link}
                    className="w-10 h-10 rounded-full bg-black hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-md shrink-0"
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
