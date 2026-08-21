"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star, Sparkles, Zap, ShieldCheck, Truck } from "lucide-react";

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
    },
    {
      title: "Anker 735 65W GaN III Fast Charger",
      category: "HyperCharge Tech",
      price: "Rs. 6,499",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      alt: "65W GaN Charger",
      link: "/shop?category=chargers",
    },
  ];

  const current = heroPreviews[selectedPreview];

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-16 sm:pb-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Floating Right Support Strip (Dexo style) */}
        <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-30 bg-white/80 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-lg text-slate-700">
          <Link
            href="/shop?category=chargers"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-[10px] font-bold"
            title="Chargers"
          >
            ⚡
          </Link>
          <Link
            href="/shop?category=audio"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-[10px] font-bold"
            title="Audio"
          >
            🎧
          </Link>
          <Link
            href="/track-order"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-colors text-[10px] font-bold"
            title="Track Order"
          >
            🚚
          </Link>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
              <span>Official Accessories in Pakistan</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">Anker, Baseus, Ugreen</span>
            </div>

            {/* Editorial Main Headline (Dexo / R&Z style) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 uppercase leading-[1.05]">
              ELEVATE YOUR <br />
              <span className="text-[#FF5500]">MOBILE</span> EXPERIENCE.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              Transform your everyday mobile charging, audio, and device protection with certified high-speed GaN chargers, durable braided cables, and precision cases.
            </p>

            {/* CTA Pill Buttons & Reviews */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-black hover:bg-[#FF5500] text-white font-bold text-sm transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-[#FF5500]/25 group"
              >
                <span>Explore Store</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>

              <Link
                href="/shop?category=chargers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold text-sm transition-colors shadow-2xs"
              >
                <Zap className="w-4 h-4 text-[#FF5500]" /> Fast Chargers
              </Link>
            </div>

            {/* Customer Rating Proof Badge (R&Z style) */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-3 text-xs">
              <div className="flex -space-x-1.5">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                  ★
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FF5500] text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                  ⚡
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                  ✓
                </div>
              </div>
              <div className="text-slate-600 font-medium">
                <strong className="text-slate-950 font-bold">4.9/5.0 Rating</strong> based on 15,000+ happy customers across Pakistan
              </div>
            </div>

            {/* Bottom mini preview switcher card */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              {heroPreviews.map((preview, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPreview(idx)}
                  className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPreview === idx
                      ? "bg-white border-black shadow-md"
                      : "bg-white/60 border-slate-200/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <Image src={preview.image} alt={preview.title} fill className="object-cover" />
                  </div>
                  <div className="text-[11px] pr-2">
                    <div className="font-bold text-slate-900 line-clamp-1">{preview.category}</div>
                    <div className="text-[#FF5500] font-black">{preview.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Visual Showcase (Dexo style organic cutout) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background organic contour circle decoration */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#FF5500]/10 to-amber-400/10 blur-2xl pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-slate-300/40 pointer-events-none scale-105" />

            {/* Main Product Showcase Card */}
            <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl bg-white p-6 border border-slate-200/90 shadow-2xl flex flex-col justify-between group">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full">
                  Flagship Tech
                </span>
                <span className="text-xs font-bold text-slate-400">Authentic Retail</span>
              </div>

              {/* Main Image */}
              <div className="relative aspect-square w-full my-auto">
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  priority
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Card Meta & Quick Link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-950 line-clamp-1">
                    {current.title}
                  </h3>
                  <div className="text-sm font-black text-[#FF5500] mt-0.5">
                    {current.price}
                  </div>
                </div>

                <Link
                  href={current.link}
                  className="w-9 h-9 rounded-full bg-black hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-md shrink-0"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
