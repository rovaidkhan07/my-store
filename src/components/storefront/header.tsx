"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { STORE_CONFIG, buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  Truck,
  ArrowUpRight,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  TrendingUp,
  Zap,
  ShieldCheck,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { totalItems, subtotal, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Customer Auth State
  const [customer, setCustomer] = useState<{
    id: string;
    name: string;
    email: string;
    role?: string;
    totalOrders?: number;
  } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logged in customer profile
  useEffect(() => {
    const checkCustomer = async () => {
      try {
        const res = await fetch("/api/auth/customer/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCustomer(data.user);
        } else {
          setCustomer(null);
        }
      } catch {
        setCustomer(null);
      }
    };
    checkCustomer();
  }, []);

  // Live Instant Search debounced fetch
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=4`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/customer/logout", { method: "POST" });
      setCustomer(null);
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setUserMenuOpen(false);
    }
  };

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

  const trendingTags = ["Anker 65W GaN", "100W USB-C Cable", "Space One ANC", "Baseus 65W Car Charger"];

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
            ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-md border-b border-stone-200/80 py-2.5"
            : "bg-[#FAF8F5] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg shadow-md group-hover:shadow-black/20"
              >
                <span className="text-[#FF5500]">M</span>H
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans leading-none">
                  Mobile<span className="text-[#FF5500]">Hub</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Official Gear
                </span>
              </div>
            </Link>

            {/* Center Floating Navigation Capsule */}
            <nav className="hidden lg:flex items-center gap-1 bg-black text-white px-5 py-2 rounded-full shadow-lg shadow-black/10">
              <Link
                href="/shop"
                className="px-3.5 py-1.5 text-xs font-bold rounded-full text-white hover:text-[#FF5500] transition-colors"
              >
                All Gear
              </Link>
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ y: -1 }}>
                  <Link
                    href={link.href}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/categories"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
            </nav>

            {/* Right Icons: Search, Customer Account, Cart, Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
                  searchOpen
                    ? "bg-black text-white border-black"
                    : "bg-white border-stone-200 text-slate-800 hover:text-black hover:border-stone-300"
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Customer Account Button & Dropdown */}
              <div className="relative">
                {customer ? (
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 h-10 px-3.5 rounded-full bg-white border border-stone-200 text-slate-900 hover:border-black transition-all shadow-2xs cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-black text-[10px]">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold max-w-[100px] truncate">
                        {customer.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-xs"
                        >
                          <div className="px-3.5 py-2 border-b border-stone-100">
                            <div className="flex items-center justify-between gap-1">
                              <div className="font-bold text-slate-950 truncate">{customer.name}</div>
                              {customer.role === "admin" && (
                                <span className="text-[9px] font-black uppercase bg-[#FF5500] text-white px-1.5 py-0.5 rounded-full shrink-0">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{customer.email}</div>
                          </div>

                          {customer.role === "admin" && (
                            <div className="p-1.5 border-b border-stone-100">
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 bg-black text-white hover:bg-[#FF5500] rounded-xl font-bold text-xs shadow-xs transition-colors group"
                              >
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF5500] group-hover:text-white" />
                                  <span>Admin Portal</span>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                              </Link>
                            </div>
                          )}

                          <Link
                            href="/account"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-stone-50 text-slate-800 font-semibold transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#FF5500]" />
                            <span>My Orders &amp; Account</span>
                          </Link>

                          <Link
                            href="/track-order"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-stone-50 text-slate-800 font-semibold transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5 text-slate-500" />
                            <span>Track Package</span>
                          </Link>

                          <div className="pt-1 border-t border-stone-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 font-semibold text-left transition-colors cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-white border border-stone-200 text-slate-800 hover:text-black hover:border-black transition-all shadow-2xs font-bold text-xs"
                  >
                    <User className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCart}
                className="flex items-center gap-2 h-10 px-4 rounded-full bg-black text-white hover:bg-[#FF5500] transition-all duration-300 shadow-md cursor-pointer group"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF5500] group-hover:bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-xs font-bold font-mono">
                  {totalItems > 0 ? formatPrice(subtotal) : "Rs. 0"}
                </span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white border border-stone-200 text-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Expandable Live Search Bar with Instant Floating Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pt-3 overflow-visible relative"
              >
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search GaN fast chargers, 100W cables, iPhone cases, AirPods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-24 rounded-2xl bg-white border-2 border-black text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none shadow-xl"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-[#FF5500] text-white rounded-xl text-xs font-black hover:bg-[#e04a00] transition-colors"
                  >
                    Search
                  </motion.button>
                </form>

                {/* Instant Floating Results Dropdown */}
                {searchQuery.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mt-2 bg-white rounded-3xl border border-stone-200 shadow-2xl p-4 space-y-3 z-50 relative"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      <span>Instant Search Matches</span>
                      {isSearching && <span className="text-[#FF5500] animate-pulse">Searching...</span>}
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-1.5">
                        {searchResults.map((product) => {
                          const img =
                            product.images?.[0]?.imageUrl ||
                            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100";

                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 overflow-hidden shrink-0">
                                  <Image src={img} alt={product.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-950 group-hover:text-[#FF5500] transition-colors line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {product.brand} • {product.category?.name || "Accessory"}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-black text-slate-950 font-mono">
                                {formatPrice(product.salePrice || product.price)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="py-4 text-center text-xs text-slate-500">
                          No exact matches found for &quot;{searchQuery}&quot;. Press Enter to view all results.
                        </div>
                      )
                    )}

                    {/* Trending Quick Search Suggestions */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Trending:</span>
                      {trendingTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchQuery(tag);
                            router.push(`/shop?search=${encodeURIComponent(tag)}`);
                            setSearchOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-black hover:text-white text-slate-700 text-[11px] font-semibold border border-stone-200 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-stone-200 p-6 space-y-4 shadow-2xl overflow-hidden"
          >
            {/* Customer Account Pill in Mobile Drawer */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-2.5">
              {customer ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                          {customer.name}
                          {customer.role === "admin" && (
                            <span className="text-[9px] font-black uppercase bg-[#FF5500] text-white px-1.5 py-0.2 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{customer.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold text-[#FF5500] hover:underline"
                    >
                      My Orders &rarr;
                    </Link>
                  </div>
                  {customer.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-black hover:bg-[#FF5500] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>Open Admin Portal</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Have an account?</span>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-[#FF5500] transition-colors"
                  >
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-stone-100"
              >
                All Products
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-stone-50"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-stone-50"
              >
                All Categories
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-stone-50"
              >
                Track Order Status
              </Link>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <a
                href={buildWhatsAppGeneralSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white bg-[#25D366]"
              >
                <MessageCircle className="w-4 h-4" /> Message Support on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
