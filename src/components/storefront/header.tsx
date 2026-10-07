"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Menu, X,
  User, MapPin
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ACTIVE_CATEGORIES } from "@/lib/config/categories";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCart();
  const router = useRouter();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full bg-[#ea580c] text-white py-2 text-[12px] font-medium hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex justify-between items-center">
          <div className="font-semibold">Get a Flat 10% Off on All Products - Limited Time Only</div>
          <div className="flex items-center">
            <Link href="/refund-policy" className="hover:underline transition-colors px-2.5">Refund & Return Policy</Link>
            <span className="opacity-40">|</span>
            <Link href="/warranty-policy" className="hover:underline transition-colors px-2.5">Warranty Policy</Link>
            <span className="opacity-40">|</span>
            <Link href="/delivery-information" className="hover:underline transition-colors px-2.5">Delivery Information</Link>
            <span className="opacity-40">|</span>
            <Link href="/contact" className="hover:underline transition-colors px-2.5">Contact Us</Link>
            <span className="opacity-40">|</span>
            <Link href="/faq" className="hover:underline transition-colors px-2.5">FAQs</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Actions) */}
      <div className={`w-full bg-white z-50 transition-all ${isScrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5 lg:px-8 h-[72px] sm:h-[86px] flex items-center justify-between gap-3 sm:gap-6 lg:gap-10">

          {/* Logo + tagline */}
          <Link href="/" className="flex flex-col shrink-0 leading-none min-w-0">
            <Image src="/logo/kharidly-logo.png" alt="Kharidly" width={160} height={40} className="h-8 sm:h-10 w-auto object-contain" priority quality={90} />
            <span className="hidden min-[420px]:block text-[9px] tracking-[0.22em] text-gray-500 font-semibold mt-1 whitespace-nowrap">PAKISTAN&apos;S PREMIUM TECH STORE</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-[600px]">
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-[#F4F5F7] rounded-full p-1.5 pl-5 h-[48px] border border-transparent focus-within:border-gray-300 transition-colors">
              <input
                type="text"
                placeholder="Find your favorite items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-900 placeholder:text-gray-500"
              />
              <button type="submit" className="bg-[#f97316] hover:bg-[#ea580c] text-white text-[13px] font-bold rounded-full px-6 h-full flex items-center gap-2 transition-colors">
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <Link href="/login" className="hidden lg:flex items-center gap-2.5 text-[13px] font-bold text-gray-800 hover:text-black transition-colors">
              <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#f97316] text-[#f97316]">
                <User className="w-4 h-4" />
              </span>
              Login / Register
            </Link>

            <Link href="/cart" className="relative flex items-center gap-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full pl-1.5 pr-2.5 min-[420px]:pr-5 py-1.5 transition-colors">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#f97316]">
                <ShoppingCart className="w-5 h-5" />
              </span>
              <span className="hidden min-[420px]:inline text-[13px] font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -mr-2 text-gray-900" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-5 pb-4">
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-[#F4F5F7] rounded-sm px-4 h-[44px] border border-gray-200 focus-within:border-gray-400 transition-colors">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-900 placeholder:text-gray-500"
            />
            <button type="submit" className="text-gray-500 hover:text-black transition-colors pl-2">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. NAVIGATION ROW (Black Bar) */}
      <div className="hidden lg:block w-full bg-[#111111] text-white h-[54px]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between h-full">
          <div className="flex items-center h-full">
            {/* Categories Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <div className="flex items-center gap-2 cursor-pointer px-6 bg-[#f97316] hover:bg-[#ea580c] transition-colors h-full">
                <Menu className="w-5 h-5" />
                <span className="text-[14px] font-bold tracking-wide">Shop By Category</span>
              </div>
              {/* Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 w-[260px] bg-white border border-gray-200 shadow-xl py-2 z-50 text-gray-900 rounded-b-md">
                  {ACTIVE_CATEGORIES.map((cat, i) => (
                    <Link key={i} href={`/shop?category=${cat.slug}`} className="block px-5 py-2.5 text-[14px] font-medium hover:text-black hover:bg-gray-50 transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Main Nav Links */}
            <nav className="flex items-center gap-8 ml-8 h-full">
              <Link href="/shop" className="text-[14px] font-semibold hover:text-gray-300 transition-colors">Shop</Link>
              <Link href="/shop?sale=true" className="text-[14px] font-bold text-[#fb923c] hover:text-[#fdba74] transition-colors">On Sale</Link>
              <Link href="/categories" className="text-[14px] font-semibold hover:text-gray-300 transition-colors">Categories</Link>
              <Link href="/about" className="text-[14px] font-semibold hover:text-gray-300 transition-colors">About Us</Link>
            </nav>
          </div>
          {/* Right Nav Links */}
          <div className="flex items-center gap-6 h-full">
            <Link href="/track-order" className="flex items-center gap-2 text-[14px] font-semibold hover:text-gray-300 transition-colors">
              <MapPin className="w-4 h-4" /> Track Your Order
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-white z-[101] shadow-2xl flex flex-col">
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <span className="font-bold text-xl text-gray-900">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {ACTIVE_CATEGORIES.map((cat, i) => (
                <Link key={i} href={`/shop?category=${cat.slug}`} className="block px-5 py-3 text-[15px] font-medium text-gray-800 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
