"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Menu, X,
  User, MapPin, Sun, Moon, ShoppingBag, Zap, Sparkles,
  Truck, Info, RotateCcw, ShieldCheck, Phone, HelpCircle,
  ChevronRight, MessageCircle, Headphones
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ACTIVE_CATEGORIES } from "@/lib/config/categories";

function DrawerItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-[#2A2F3A] group"
    >
      <span className="w-11 h-11 rounded-xl bg-[#FFF3E8] dark:bg-[#2A1E12] flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
    </Link>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"menu" | "important">("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { items } = useCart();
  const router = useRouter();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kharidly-theme");
      const initial = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("kharidly-theme", next);
    } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
  };

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
    <>
      {/* FIXED HEADER — utility bar + main header + nav stay fixed on scroll */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col">
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full bg-accent text-white py-2 text-[12px] font-medium hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex justify-between items-center">
          <div className="font-semibold">Get a Flat 10% Off on All Products - Limited Time Only</div>
          <div className="flex items-center gap-4">
            <Link href="/refund-policy" className="hover:underline transition-colors">Refund & Return Policy</Link>
            <span className="opacity-40">|</span>
            <Link href="/warranty-policy" className="hover:underline transition-colors">Warranty Policy</Link>
            <span className="opacity-40">|</span>
            <Link href="/delivery-information" className="hover:underline transition-colors">Delivery Information</Link>
            <span className="opacity-40">|</span>
            <Link href="/contact" className="hover:underline transition-colors">Contact Us</Link>
            <span className="opacity-40">|</span>
            <Link href="/faq" className="hover:underline transition-colors">FAQs</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Actions) */}
      <div className={`w-full bg-white dark:bg-[#15181E] transition-all ${isScrolled ? "shadow-sm dark:shadow-black/40" : ""}`}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[86px] grid grid-cols-3 items-center lg:flex lg:justify-between gap-4 lg:gap-10">

          {/* Mobile Menu Toggle (Left on Mobile) */}
          <div className="flex lg:hidden justify-start">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-900 dark:text-gray-100 active:scale-95 transition-transform">
              <Menu className="w-6 h-7" />
            </button>
          </div>

          {/* Logo + tagline (Center on Mobile, Left on Desktop) */}
          <div className="flex justify-center lg:justify-start lg:shrink-0">
            <Link href="/" className="flex flex-col shrink-0 leading-none group items-center lg:items-start">
              {/* Light Mode Logo */}
              <Image src="/logo/kharidly-logo.png" alt="Kharidly" width={160} height={40} className="h-8 sm:h-10 w-auto object-contain dark:hidden" priority quality={90} />
              {/* Dark Mode Logo */}
              <Image src="/logo/logo-white.svg" alt="Kharidly" width={160} height={40} className="h-8 sm:h-10 w-auto object-contain hidden dark:block" priority quality={90} />
              
              <span className="text-[10px] sm:text-xs tracking-[0.22em] text-gray-500 dark:text-gray-400 font-semibold mt-1 group-hover:text-black dark:group-hover:text-white transition-colors hidden sm:block">Pakistan&apos;s Premium Tech Store</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-[600px]">
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-secondary dark:bg-[#1C2028] rounded-full p-1.5 pl-5 h-[44px] border border-transparent dark:border-[#2A2F3A] focus-within:border-gray-300 dark:focus-within:border-primary transition-colors">
              <input
                type="text"
                placeholder="Find your favorite items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full flex-1 pl-4 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <button type="submit" className="bg-primary hover:bg-accent text-white text-sm font-bold rounded-full px-6 h-[calc(100%-8px)] flex items-center justify-center gap-2 transition-colors">
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center justify-end gap-5 shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 dark:border-[#2A2F3A] text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link href="/login" className="hidden lg:flex items-center gap-2.5 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
              <span className="flex items-center justify-center w-[44px] h-[44px] rounded-full border-2 border-primary text-primary">
                <User className="w-4 h-4" />
              </span>
              Login / Register
            </Link>

            <Link href="/cart" className="relative flex items-center justify-center sm:gap-2.5 sm:bg-primary sm:hover:bg-accent sm:text-white rounded-full sm:pl-1.5 sm:pr-5 transition-colors w-10 h-10 sm:w-auto sm:h-[44px] text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary">
              <span className="flex items-center justify-center w-9 h-9 rounded-full sm:bg-white sm:text-primary">
                <ShoppingCart className="w-6 h-6 sm:w-5 sm:h-5" />
              </span>
              <span className="hidden sm:block text-sm font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#15181E]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-5 pb-4">
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-secondary dark:bg-[#1C2028] rounded-sm px-4 h-[44px] border border-gray-200 dark:border-[#2A2F3A] focus-within:border-gray-400 transition-colors">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full flex-1 pl-4 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors pl-2">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. NAVIGATION ROW (Black Bar) */}
      <div className="hidden lg:block w-full bg-gray-950 text-white h-[54px]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between h-full">
          <div className="flex items-center h-full">
            {/* Categories Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <div className="flex items-center gap-2 cursor-pointer px-6 bg-gray-900 hover:bg-black transition-colors h-full">
                <Menu className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">Shop By Category</span>
              </div>
              {/* Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 w-[260px] bg-white dark:bg-[#15181E] border border-gray-200 dark:border-[#2A2F3A] shadow-xl py-2 z-50 text-gray-900 dark:text-gray-100 rounded-b-md">
                  {ACTIVE_CATEGORIES.map((cat, i) => (
                    <Link key={i} href={`/shop?category=${cat.slug}`} className="block px-5 py-2.5 text-sm font-medium hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1C2028] transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Main Nav Links */}
            <nav className="flex items-center gap-8 ml-8 h-full">
              <Link href="/shop" className="text-sm font-semibold hover:text-gray-300 transition-colors">Shop</Link>
              <Link href="/shop?sale=true" className="text-sm font-bold text-[#fb923c] hover:text-[#fdba74] transition-colors">On Sale</Link>
                            <Link href="/about" className="text-sm font-semibold hover:text-gray-300 transition-colors">About Us</Link>
            </nav>
          </div>
          {/* Right Nav Links */}
          <div className="flex items-center gap-6 h-full">
            <Link href="/track-order" className="flex items-center gap-2 text-sm font-semibold hover:text-gray-300 transition-colors">
              <Truck className="w-4 h-4" /> Track Your Order
            </Link>
          </div>
        </div>
      </div>
      </div>
      {/* END FIXED HEADER */}
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[146px] lg:h-[172px] w-full shrink-0" aria-hidden="true" />

      {/* Mobile Drawer — premium competitor-style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[85%] max-w-[320px] h-full bg-white dark:bg-[#15181E] z-[101] shadow-2xl flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 p-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Tabs: MENU / IMPORTANT */}
              <div className="px-5 pt-6 pb-2">
                <div className="flex bg-gray-100 dark:bg-[#1C2028] rounded-xl p-1.5 gap-1">
                  <button
                    onClick={() => setDrawerTab("menu")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-colors ${drawerTab === "menu" ? "bg-primary text-white shadow" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    MENU
                  </button>
                  <button
                    onClick={() => setDrawerTab("important")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-colors ${drawerTab === "important" ? "bg-primary text-white shadow" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    IMPORTANT
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                {drawerTab === "menu" ? (
                  <>
                    <DrawerItem href="/shop" icon={<ShoppingBag className="w-5 h-5" />} label="Shop All Products" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/shop?sale=true" icon={<Zap className="w-5 h-5" />} label="On Sale" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/shop?sort=newest" icon={<Sparkles className="w-5 h-5" />} label="New Arrivals" onClick={() => setIsMobileMenuOpen(false)} />
                    {ACTIVE_CATEGORIES.map((cat, i) => (
                      <DrawerItem key={i} href={`/shop?category=${cat.slug}`} icon={<Headphones className="w-5 h-5" />} label={cat.name} onClick={() => setIsMobileMenuOpen(false)} />
                    ))}
                    <DrawerItem href="/track-order" icon={<Truck className="w-5 h-5" />} label="Track Your Order" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/about" icon={<Info className="w-5 h-5" />} label="About Us" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <DrawerItem href="/refund-policy" icon={<RotateCcw className="w-5 h-5" />} label="Refund & Return Policy" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/warranty-policy" icon={<ShieldCheck className="w-5 h-5" />} label="Warranty Policy" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/delivery-information" icon={<Truck className="w-5 h-5" />} label="Delivery Information" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/contact" icon={<Phone className="w-5 h-5" />} label="Contact Us" onClick={() => setIsMobileMenuOpen(false)} />
                    <DrawerItem href="/faq" icon={<HelpCircle className="w-5 h-5" />} label="FAQs" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                )}
              </div>

              {/* Social icons */}
              <div className="px-5 py-4 flex items-center justify-center gap-3 border-t border-gray-100 dark:border-[#2A2F3A]">
                <a href="https://wa.me/923005879869" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-[#E8F9EE] dark:bg-[#1C2B22] flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

              {/* Login / Sign up */}
              <div className="px-5 pb-6 pt-2 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-primary text-primary text-sm font-bold text-center hover:bg-primary/5 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-accent text-white text-sm font-bold text-center transition-colors shadow-md shadow-orange-500/20"
                >
                  SIGN UP
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}









