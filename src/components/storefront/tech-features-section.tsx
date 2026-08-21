"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Headphones, ArrowUpRight } from "lucide-react";

export function TechFeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: Zap,
      title: "GaN III HyperCharge",
      subtitle: "Full Speed Power Transfer",
      description:
        "Engineered with cutting-edge Gallium Nitride semiconductors for 3x faster charging speeds at 40% cooler operating temperatures.",
      tag: "65W & 100W PD",
      link: "/shop?category=chargers",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    },
    {
      icon: ShieldCheck,
      title: "Military-Grade Durability",
      subtitle: "Kevlar Fiber & Zinc Alloy",
      description:
        "Tested to withstand over 25,000 extreme bends and heavy drops. Built for rigorous everyday usage across Pakistan.",
      tag: "25,000+ Bend Test",
      link: "/shop?category=cables",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    },
    {
      icon: Headphones,
      title: "Active Noise Cancellation",
      subtitle: "Pure Acoustic Immersion",
      description:
        "Custom 40mm bio-cellulose dynamic drivers with LDAC Hi-Res audio certification for crystal-clear vocals and punchy bass.",
      tag: "Hi-Res Audio",
      link: "/shop?category=audio",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const current = features[activeTab];
  const Icon = current.icon;

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[2.5rem] bg-black text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Ambient Breathing Radial Light Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5500]/25 rounded-full blur-[100px] pointer-events-none"
          />

          {/* Section Header */}
          <div className="max-w-2xl mb-10 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block mb-2">
              Next-Gen Performance
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Engineered for Excellence, <br />
              <span className="text-stone-400">Perfected for You</span>
            </h2>
          </div>

          {/* 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Lifestyle Cutout Box with Crossfade */}
            <div className="lg:col-span-6 relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-stone-900 border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Bottom animated frequency waveform bars (Dexo Style) */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center gap-2.5">
                  {/* Bouncing Visualizer Bars */}
                  <div className="flex items-end gap-1 h-5">
                    {[12, 20, 16, 24, 14, 18, 22].map((height, i) => (
                      <motion.span
                        key={i}
                        animate={{
                          height: [`${height * 0.4}px`, `${height}px`, `${height * 0.3}px`],
                        }}
                        transition={{
                          duration: 0.8 + i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-1 bg-[#FF5500] rounded-full"
                      />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-xs">Acoustic &amp; Power Sync</span>
                </div>
                <span className="font-mono text-[11px] text-stone-400">100% Certified</span>
              </div>
            </div>

            {/* Right Interactive Glassmorphic Feature Card */}
            <div className="lg:col-span-6 space-y-6">
              {/* Feature Pill Tabs with sliding indicator */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {features.map((feat, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                      activeTab === idx
                        ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25"
                        : "bg-white/10 text-stone-400 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    {feat.title}
                  </motion.button>
                ))}
              </div>

              {/* Main Feature Display Card with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-stone-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {current.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">{current.title}</h3>
                    <div className="text-xs font-bold text-[#FF5500] mt-0.5">{current.subtitle}</div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <motion.div whileHover={{ x: 4 }}>
                      <Link
                        href={current.link}
                        className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#FF5500] transition-colors"
                      >
                        <span>Explore Products</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </motion.div>

                    {/* Carousel Indicator Dots */}
                    <div className="flex items-center gap-1.5">
                      {features.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTab(i)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            activeTab === i ? "w-6 bg-[#FF5500]" : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
