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
                <span className="font-bold text-[15px] mb-1">Genuine Products!</span>
                <span className="text-[13px] text-gray-400">100% authentic electronics</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-[15px] mb-1">Fast Delivery</span>
                <span className="text-[13px] text-gray-400">Quick and secure shipping</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-[15px] mb-1">Secure Payments</span>
                <span className="text-[13px] text-gray-400">Safe online payment methods</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-white stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="font-bold text-[15px] mb-1">Easy Returns</span>
                <span className="text-[13px] text-gray-400">Simple replacement process</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#111111] text-white pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Logo & Description */}
            <div className="flex flex-col gap-6 items-start">
              <Link href="/" className="flex items-center">
                <div className="bg-white px-4 py-2 rounded-sm inline-flex">
                  <Image src="/logo/kharidly-logo.png" alt="Kharidly" width={128} height={32} className="h-8 w-auto object-contain" loading="lazy" />
                </div>
              </Link>
              <p className="text-[#A0A0A0] text-[14px] leading-relaxed">
                Kharidly Electronics is a modern electronics retail store offering the latest gadgets.
              </p>
              
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                  <span className="text-[14px] font-bold">P</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                  <span className="text-[14px] font-bold">X</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                  <span className="text-[14px] font-bold">f</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                  <span className="text-[14px] font-bold">ig</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Quick Links</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Home</Link>
                <Link href="/shop" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Shop</Link>
                <Link href="/about" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">About Us</Link>
                <Link href="/blog" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Blog</Link>
                <Link href="/contact" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Contact Us</Link>
              </nav>
            </div>

            {/* Product Categories */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Product Categories</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/shop?category=home" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Home Electronics</Link>
                <Link href="/shop?category=office" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Office Electronics</Link>
                <Link href="/shop?category=gaming" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Gaming Accessories</Link>
                <Link href="/shop?category=audio" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Audio Systems</Link>
                <Link href="/shop?category=computer" className="text-[#A0A0A0] hover:text-white text-[14px] transition-colors w-max">Computer Accessories</Link>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-[16px] text-white">Our Newsletter</h4>
              <p className="text-[#A0A0A0] text-[14px] leading-relaxed mb-1">
                Get exclusive offers, product launches, technology news.
              </p>
              
              <div className="flex w-full bg-[#2A2A2A] rounded-md h-[48px]">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 text-[14px] text-white placeholder:text-gray-500"
                />
                <button className="bg-white text-black h-full px-4 rounded-r-md flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 text-[#A0A0A0] text-[12px] flex items-center gap-2">
                Subscribe <span className="inline-block px-1.5 py-0.5 bg-yellow-500 text-black text-[9px] font-bold rounded-sm">LIMITED TIME OFFER</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0A0A0] text-[14px]">
              Copyright © {new Date().getFullYear()} All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-white rounded-sm font-black text-black text-[10px]">CASH ON DELIVERY</div>
                <div className="px-2 py-1 bg-white rounded-sm font-black text-black text-[10px]">BANK TRANSFER</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}




