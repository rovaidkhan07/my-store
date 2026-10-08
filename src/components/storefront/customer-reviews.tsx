"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export function CustomerReviews() {
  const reviews = [
    {
      name: "Bilal Tariq",
      city: "Karachi",
      role: "Verified Buyer",
      comment:
        "Ordered the Anker 65W GaN charger. Received it in DHA Phase 6 in less than 24 hours via Cash on Delivery. 100% genuine pack with working serial number. Extremely satisfied!",
      product: "Anker 735 65W GaN Charger",
      rating: 5,
    },
    {
      name: "Zainab Malik",
      city: "Lahore",
      role: "Verified Buyer",
      comment:
        "The braided 100W USB-C cable is super thick and durable. No loose fittings and charges my MacBook Pro at full speed. Customer support on WhatsApp was prompt and helpful.",
      product: "Baseus Tungsten Gold 100W Cable",
      rating: 5,
    },
    {
      name: "Hamza Farooq",
      city: "Islamabad",
      role: "Verified Buyer",
      comment:
        "Best accessory store in Pakistan hands down. The MagSafe case fits my 15 Pro Max like a glove and the magnets are super strong. Will definitely buy again.",
      product: "Joyroom MagSafe Armor Case",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  const next = () => setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));

  const current = reviews[activeIndex];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#15181E] border-b border-border/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-accent block mb-1">
              Social Proof &amp; Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Customer Voices on <br className="hidden sm:inline" />Kharidly
            </h2>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={prev}
              className="w-10 h-10 rounded-full bg-background border border-border text-slate-800 dark:text-slate-200 hover:bg-primary hover:text-white dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={next}
              className="w-10 h-10 rounded-full bg-background border border-border text-slate-800 dark:text-slate-200 hover:bg-primary hover:text-white dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Featured Review Card with AnimatePresence */}
        <div className="rounded-3xl bg-background border border-border/90 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Quote Details with animated slide transition */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="min-h-[100px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={current.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg sm:text-2xl font-bold text-slate-950 dark:text-white leading-relaxed"
                  >
                    &ldquo;{current.comment}&rdquo;
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">
                  {current.name[0]}
                </div>
                <div>
                  <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-1.5">
                    {current.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </div>
                  <div className="text-xs text-slate-500">
                    {current.city}, Pakistan • Purchased <strong>{current.product}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mini Stats Card */}
            <div className="lg:col-span-4 bg-white dark:bg-[#15181E] p-6 rounded-2xl border border-border/90 shadow-sm space-y-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Verified Customer Feedback
              </div>
              <div className="text-2xl font-black text-slate-950 dark:text-white font-mono">
                15,400+
              </div>
              <div className="text-xs text-slate-600 font-medium leading-relaxed">
                Parcels successfully delivered across Pakistan with average delivery speed of 2.1 days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

