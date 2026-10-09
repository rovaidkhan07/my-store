import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Truck, ShieldCheck, RefreshCw, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full font-sans">
      
      {/* Top Feature Bar */}
      <div className="bg-[#1C1F22] text-white py-8 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-base mb-1">Genuine Products!</span>
                <span className="text-sm text-gray-400">100% authentic electronics</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-base mb-1">Fast Delivery</span>
                <span className="text-sm text-gray-400">Quick and secure shipping</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-base mb-1">Secure Payments</span>
                <span className="text-sm text-gray-400">Safe online payment methods</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-base mb-1">Easy Returns</span>
                <span className="text-sm text-gray-400">Simple replacement process</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-950 text-white pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Logo & Description */}
            <div className="flex flex-col gap-6 items-start">
              <Link href="/" className="flex items-center">
                <div className="bg-white px-4 py-2 rounded-sm inline-flex">
                  <Image src="/logo/kharidly-logo.png" alt="Kharidly" width={128} height={32} className="h-8 w-auto object-contain" loading="lazy" />
                </div>
              </Link>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                Kharidly Electronics is a modern electronics retail store offering the latest gadgets.
              </p>
              
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white transition-colors group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform group-hover:scale-110"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.188 0 7.449 2.986 7.449 6.969 0 4.167-2.626 7.521-6.273 7.521-1.225 0-2.378-.636-2.772-1.391l-.754 2.873c-.272 1.039-1.01 2.34-1.503 3.136 1.439.444 2.964.685 4.537.685 6.621 0 11.988-5.367 11.988-11.988C24.004 5.367 18.638 0 12.017 0z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white transition-colors group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] transition-transform group-hover:scale-110"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white transition-colors group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform group-hover:scale-110"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white transition-colors group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform group-hover:scale-110"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Quick Links</h4>
              <nav className="flex flex-col gap-6 sm:gap-3">
                <Link href="/" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Home</Link>
                <Link href="/shop" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Shop</Link>
                <Link href="/about" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">About Us</Link>
                <Link href="/blog" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Blog</Link>
                <Link href="/contact" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Contact Us</Link>
              </nav>
            </div>

            {/* Product Categories */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Product Categories</h4>
              <nav className="flex flex-col gap-6 sm:gap-3">
                <Link href="/shop?category=home" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Home Electronics</Link>
                <Link href="/shop?category=office" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Office Electronics</Link>
                <Link href="/shop?category=gaming" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Gaming Accessories</Link>
                <Link href="/shop?category=audio" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Audio Systems</Link>
                <Link href="/shop?category=computer" className="text-[#A0A0A0] hover:text-white text-sm transition-colors w-max">Computer Accessories</Link>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Our Newsletter</h4>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-1">
                Get exclusive offers, product launches, technology news.
              </p>
              
              <div className="flex w-full bg-[#2A2A2A] rounded-md h-[48px]">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-white placeholder:text-gray-500"
                />
                <button className="bg-white text-black h-full px-4 rounded-r-md flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Send className="w-4 h-4" /><span className="ml-2 font-bold text-sm">Subscribe</span></button>
              </div>

              <div className="mt-2 text-[#A0A0A0] text-[12px] flex items-center gap-2"> Join our newsletter <span className="inline-block px-1.5 py-0.5 bg-yellow-500 text-black text-[9px] font-bold rounded-sm">Limited Time Offer</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0A0A0] text-sm">
              Copyright © {new Date().getFullYear()} All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">CASH ON DELIVERY</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">BANK TRANSFER</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}










