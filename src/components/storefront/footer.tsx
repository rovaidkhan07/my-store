"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STORE_CONFIG, buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";
import {
  Zap,
  Send,
  Check,
  MessageCircle,
  Globe,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const brandLogos = [
    { name: "ANKER", font: "tracking-widest font-black text-slate-800 text-lg" },
    { name: "BASEUS", font: "tracking-widest font-black text-slate-800 text-lg" },
    { name: "UGREEN", font: "tracking-widest font-black text-slate-800 text-lg" },
    { name: "JOYROOM", font: "tracking-widest font-black text-slate-800 text-lg" },
    { name: "SAMSUNG", font: "tracking-widest font-black text-slate-800 text-lg" },
    { name: "LEOPARDS / TCS", font: "tracking-wider font-bold text-slate-600 text-sm" },
  ];

  return (
    <footer className="bg-[#FAF6F0] text-slate-800 border-t border-stone-200/90 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Section: "Trusted by top brands / Official Partners" (Envato style) */}
        <div className="text-center space-y-8 pb-12 border-b border-stone-200/80">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Trusted by 50,000+ Customers &amp; Official Brands
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct authentic accessories with 7-day replacement warranty and nationwide delivery across Pakistan.
            </p>
          </div>

          {/* Monochrome Brand Logos Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 hover:opacity-100 transition-opacity">
            {brandLogos.map((brand, idx) => (
              <div key={idx} className="flex items-center gap-2 select-none grayscale hover:grayscale-0 transition-all">
                <span className={brand.font}>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Grid (Envato Style: Left Brand + Newsletter | Right 4 Nav Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Brand Logo, Socials, & Newsletter Input */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm group-hover:bg-[#FF5500] transition-colors">
                <Zap className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950">
                Mobile<span className="text-[#FF5500]">Hub</span>
              </span>
            </Link>

            {/* Social Icons Row (Envato Style) */}
            <div className="flex items-center gap-3 text-slate-600">
              <a
                href={buildWhatsAppGeneralSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-stone-300/80 hover:border-black hover:text-black flex items-center justify-center transition-colors shadow-2xs"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </a>

              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-stone-300/80 hover:border-black hover:text-black flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-stone-300/80 hover:border-black hover:text-black flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>

              {/* X / Twitter SVG */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-stone-300/80 hover:border-black hover:text-black flex items-center justify-center transition-colors shadow-2xs"
                aria-label="X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            {/* Newsletter Subscription Box (Envato Style) */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                <strong>Yes to exclusive gadget deals in your inbox.</strong> Fresh product drops, discounts, and tech guides (no spam).
              </p>

              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                {subscribed ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>You&apos;re subscribed! Use promo code <strong>MH300</strong> for Rs. 300 off.</span>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-4 pr-11 rounded-xl bg-white border border-stone-300 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-black hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Subscribe"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </form>
              <span className="text-[10px] text-slate-400 block">
                Unsubscribe any time. Read our Privacy Policy.
              </span>
            </div>
          </div>

          {/* Right Columns: Structured Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            {/* Column 1: Discover */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">
                Discover
              </h4>
              <ul className="space-y-2.5 text-slate-600">
                <li>
                  <Link href="/shop?category=chargers" className="hover:text-black transition-colors">
                    Fast Wall Chargers
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=cables" className="hover:text-black transition-colors">
                    Type-C &amp; PD Cables
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=power-banks" className="hover:text-black transition-colors">
                    High-Capacity Power Banks
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=cases" className="hover:text-black transition-colors">
                    MagSafe Phone Cases
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=audio" className="hover:text-black transition-colors">
                    Wireless Earbuds &amp; ANC
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=screen-protectors" className="hover:text-black transition-colors">
                    9H Tempered Glass
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=car-accessories" className="hover:text-black transition-colors">
                    Car Mounts &amp; Fast Adapters
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Order & Help */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">
                Orders &amp; Terms
              </h4>
              <ul className="space-y-2.5 text-slate-600">
                <li>
                  <Link href="/track-order" className="hover:text-black transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-black transition-colors">
                    Cash on Delivery Info
                  </Link>
                </li>
                <li>
                  <Link href="/order-confirmation/ORD-SAMPLE" className="hover:text-black transition-colors">
                    Bank Transfer Guide
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    Shipping &amp; Delivery Rates
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    7-Day Replacement Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-black transition-colors text-slate-400">
                    Staff Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: About & Trust */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">
                About Us
              </h4>
              <ul className="space-y-2.5 text-slate-600">
                <li>
                  <span className="text-slate-900 font-semibold">{STORE_CONFIG.name} Pakistan</span>
                </li>
                <li>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Direct retail partner for Anker, Baseus, Ugreen, and premium mobile accessories.
                  </p>
                </li>
                <li className="pt-1">
                  <span className="text-slate-900 font-semibold">Store Address:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{STORE_CONFIG.address}</p>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & WhatsApp */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">
                Helpline
              </h4>
              <ul className="space-y-2.5 text-slate-600">
                <li>
                  <a
                    href={buildWhatsAppGeneralSupportUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Live Chat
                  </a>
                </li>
                <li>
                  <span className="text-slate-500">Call / SMS:</span>
                  <div className="font-bold text-slate-900">{STORE_CONFIG.phone}</div>
                </li>
                <li>
                  <span className="text-slate-500">Email:</span>
                  <div className="font-semibold text-slate-900">{STORE_CONFIG.email}</div>
                </li>
                <li className="pt-1 text-[11px] text-slate-400">
                  Daily Support: 10:00 AM – 10:00 PM PKT
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar (Envato Style) */}
        <div className="pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 font-medium text-[11px]">
            <Link href="/shop" className="hover:text-black">All Accessories</Link>
            <span>•</span>
            <Link href="/shop?category=chargers" className="hover:text-black">Fast Chargers</Link>
            <span>•</span>
            <Link href="/shop?category=cables" className="hover:text-black">Cables</Link>
            <span>•</span>
            <Link href="/shop?category=power-banks" className="hover:text-black">Power Banks</Link>
            <span>•</span>
            <Link href="/shop?category=cases" className="hover:text-black">Cases &amp; Covers</Link>
            <span>•</span>
            <Link href="/track-order" className="hover:text-black">Track Order</Link>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>© {new Date().getFullYear()} {STORE_CONFIG.name}. All rights reserved.</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 bg-white border border-stone-200/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Globe className="w-3 h-3 text-slate-500" />
              <span>Pakistan (PKR)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
