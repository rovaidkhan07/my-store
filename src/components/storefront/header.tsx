"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { STORE_CONFIG, buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";
import { formatPrice } from "@/lib/utils";
import {
  Zap,
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  Truck,
  ArrowUpRight,
  Sparkles,
  Phone,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { totalItems, subtotal, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Fast Chargers", href: "/shop?category=chargers" },
    { name: "Cables", href: "/shop?category=cables" },
    { name: "Power Banks", href: "/shop?category=power-banks" },
    { name: "Cases", href: "/shop?category=cases" },
    { name: "Audio", href: "/shop?category=audio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top micro announcement bar */}
      <div className="bg-[#0A0D14] text-slate-300 text-[11px] font-medium py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#FF5500] font-bold">
              <Sparkles className="w-3 h-3" /> Nationwide Cash on Delivery
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">
              Free Express Delivery on orders above {formatPrice(STORE_CONFIG.freeDeliveryThreshold)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#FF5500]" />
              <span className="hidden md:inline">Track Order</span>
            </Link>
            <span className="text-slate-700">|</span>
            <a
              href={buildWhatsAppGeneralSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors flex items-center gap-1 font-semibold text-slate-300"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Floating Capsule Header */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
            : "bg-[#FAF8F5] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-[#FF5500]">M</span>H
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
                Mobile<span className="text-[#FF5500]">Hub</span>
              </span>
            </Link>

            {/* Center Floating Navigation Capsule (Dexo Style) */}
            <nav className="hidden lg:flex items-center gap-1 bg-black text-white px-5 py-2 rounded-full shadow-lg shadow-black/10">
              <Link
                href="/shop"
                className="px-3.5 py-1.5 text-xs font-bold rounded-full text-white hover:text-[#FF5500] transition-colors"
              >
                All Gear
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/categories"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
            </nav>

            {/* Right Icons: Search, Cart, Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:text-black hover:border-slate-300 transition-all cursor-pointer shadow-xs"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="flex items-center gap-2 h-10 px-4 rounded-full bg-black text-white hover:bg-[#FF5500] transition-all duration-300 shadow-md cursor-pointer group"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF5500] group-hover:bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold font-mono">
                  {totalItems > 0 ? formatPrice(subtotal) : "Rs. 0"}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Expandable Search Input Bar */}
          {searchOpen && (
            <div className="pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search GaN fast chargers, 100W cables, iPhone cases, AirPods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-12 pl-12 pr-24 rounded-2xl bg-white border-2 border-black text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none shadow-xl"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-[#FF5500] text-white rounded-xl text-xs font-black hover:bg-[#e04a00] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-slate-100"
            >
              All Products
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              All Categories
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Track Order Status
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={buildWhatsAppGeneralSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white bg-[#25D366]"
            >
              <MessageCircle className="w-4 h-4" /> Message Support on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
