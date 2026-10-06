"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, Heart, ShoppingCart, Menu, X, 
  ChevronDown, User, Percent, Phone
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
      <div className="w-full bg-[#F4F5F7] text-[#4A4A4A] py-2 border-b border-gray-200 text-[12px] font-medium hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex justify-between items-center">
          <div>Get a Flat 10% Off on All Products - Limited Time Only</div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link>
            <Link href="/faq" className="hover:text-black transition-colors">FAQs</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Icons) */}
      <div className={`w-full bg-white z-50 transition-all ${isScrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[80px] flex items-center justify-between gap-6 lg:gap-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo/kharidly-logo.png" alt="Kharidly" className="h-10 w-auto object-contain" />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-[600px]">
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-[#F4F5F7] rounded-full px-5 h-[46px] border border-transparent focus-within:border-gray-300 transition-colors">
              <input
                type="text"
                placeholder="Search By Products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-900 placeholder:text-gray-500"
              />
              <button type="submit" className="text-gray-500 hover:text-black transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-5 shrink-0">
            <Link href="/wishlist" className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>
            
            <Link href="/cart" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full group-hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-[13px] font-bold text-gray-800">My Cart</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-900">
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
              <div className="flex items-center gap-2 cursor-pointer pr-8 border-r border-white/20 h-full">
                <Menu className="w-5 h-5" />
                <span className="text-[14px] font-semibold tracking-wide">Popular Categories</span>
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
              <Link href="/" className="text-[14px] font-semibold hover:text-gray-300 transition-colors flex items-center gap-1">Home <ChevronDown className="w-3.5 h-3.5" /></Link>
              <Link href="/shop" className="text-[14px] font-semibold hover:text-gray-300 transition-colors flex items-center gap-1">Shop <ChevronDown className="w-3.5 h-3.5" /></Link>
              <Link href="/blog" className="text-[14px] font-semibold hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/shop" className="text-[14px] font-semibold hover:text-gray-300 transition-colors flex items-center gap-1">Collection <ChevronDown className="w-3.5 h-3.5" /></Link>
              <Link href="/account" className="text-[14px] font-semibold hover:text-gray-300 transition-colors flex items-center gap-1">My Account <ChevronDown className="w-3.5 h-3.5" /></Link>
              <Link href="/faq" className="text-[14px] font-semibold hover:text-gray-300 transition-colors flex items-center gap-1">Pages <ChevronDown className="w-3.5 h-3.5" /></Link>
            </nav>
          </div>

          {/* Right Nav Links */}
          <div className="flex items-center gap-6 h-full">
            <Link href="/shop?sale=true" className="flex items-center gap-2 text-[14px] font-semibold hover:text-gray-300 transition-colors">
              <Percent className="w-4 h-4" /> Sale Off
            </Link>
            <Link href="/account" className="flex items-center gap-2 text-[14px] font-semibold hover:text-gray-300 transition-colors">
              <User className="w-4 h-4" /> My Account
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

