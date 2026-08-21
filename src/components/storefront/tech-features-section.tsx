"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ShieldCheck, Headphones, ArrowUpRight, CheckCircle2 } from "lucide-react";

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
    },
    {
      icon: ShieldCheck,
      title: "Military-Grade Durability",
      subtitle: "Kevlar Fiber & Zinc Alloy",
      description:
        "Tested to withstand over 25,000 extreme bends and heavy drops. Built for rigorous everyday usage across Pakistan.",
      tag: "25,000+ Bend Test",
      link: "/shop?category=cables",
    },
    {
      icon: Headphones,
      title: "Active Noise Cancellation",
      subtitle: "Pure Acoustic Immersion",
      description:
        "Custom 40mm bio-cellulose dynamic drivers with LDAC Hi-Res audio certification for crystal-clear vocals and punchy bass.",
      tag: "Hi-Res Audio",
      link: "/shop?category=audio",
    },
  ];

  const current = features[activeTab];
  const Icon = current.icon;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-black text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block mb-2">
              Next-Gen Performance
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Engineered for Excellence, <br />
              <span className="text-slate-400">Perfected for You</span>
            </h2>
          </div>

          {/* 2-Column Content Grid (Dexo Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Lifestyle Cutout Box */}
            <div className="lg:col-span-6 relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 group">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Engineering Excellence"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Bottom waveform overlay */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-bold">100% Certified Original</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">Anker • Baseus • Ugreen</span>
              </div>
            </div>

            {/* Right Interactive Glassmorphic Feature Card (Dexo Style) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Feature Pill Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {features.map((feat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === idx
                        ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25"
                        : "bg-white/10 text-slate-400 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    {feat.title}
                  </button>
                ))}
              </div>

              {/* Main Feature Display Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {current.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{current.title}</h3>
                  <div className="text-xs font-bold text-[#FF5500] mt-0.5">{current.subtitle}</div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={current.link}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#FF5500] transition-colors"
                  >
                    <span>Explore Products</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
