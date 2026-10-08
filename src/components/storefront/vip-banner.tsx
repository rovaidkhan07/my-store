"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    <section className="py-14 sm:py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[2.5rem] bg-primary text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl"
        >
          {/* Ambient Glow */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 w-80 h-80 bg-primary/25 rounded-full blur-[90px] pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-black capitalize tracking-widest text-accent">
                <Sparkles className="w-3.5 h-3.5" /> Kharidly VIP Club
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Be the first to <br />
                <span className="text-gray-400">Experience Excellence</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Join 25,000+ tech enthusiasts in Pakistan. Get exclusive secret flash sales, product drops, and a Rs. 300 voucher on your next order.
              </p>

              {/* Input Form with AnimatePresence */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0">
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-white/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>You&apos;re on the VIP list! Use promo code <strong>MH300</strong> at checkout.</span>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="relative flex items-center"
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 pl-5 pr-32 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-white/50 outline-none focus:border-primary focus:bg-white/15 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 bg-white dark:bg-[#15181E] hover:bg-primary text-slate-950 hover:text-white rounded-full text-xs font-black transition-all cursor-pointer shadow-md"
                      >
                        Subscribe
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right 3D Visual with Floating Physics */}
            <div className="lg:col-span-5 relative aspect-square max-w-xs mx-auto">
              <motion.div
                animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
                  alt="Earbuds"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}




