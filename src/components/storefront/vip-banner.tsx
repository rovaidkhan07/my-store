"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export function VipBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-black text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#FF5500]">
                <Sparkles className="w-3.5 h-3.5" /> MobileHub VIP Club
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Be the first to <br />
                <span className="text-slate-400">Experience Excellence</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Join 25,000+ tech enthusiasts in Pakistan. Get exclusive secret flash sales, product drops, and a Rs. 300 voucher on your next order.
              </p>

              {/* Input Form (Dexo Style) */}
              <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto lg:mx-0">
                {isSubscribed ? (
                  <div className="p-4 rounded-2xl bg-white/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>You&apos;re on the VIP list! Use promo code <strong>MH300</strong> at checkout.</span>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-5 pr-32 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#FF5500] focus:bg-white/15"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 bg-white hover:bg-[#FF5500] text-slate-950 hover:text-white rounded-full text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      Subscribe
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Right 3D Visual Cutout (Dexo Style) */}
            <div className="lg:col-span-5 relative aspect-square max-w-xs mx-auto">
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
                  alt="Earbuds"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
