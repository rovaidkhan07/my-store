"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  const promoCards = [
    {
      kicker: "Home Tech\n• Digital Home",
      discount: "Up To 20% Discount",
      title: "Essential Smart\nAppliances",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
      link: "/shop?category=chargers",
    },
    {
      kicker: "Home Tech\n• Digital Home",
      discount: "Up To 20% Discount",
      title: "Smart Business\nGadgets",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
      link: "/shop?category=audio",
    },
    {
      kicker: "Home Tech\n• Digital Home",
      discount: "Up To 20% Discount",
      title: "Essential Smart\nAppliances",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      link: "/shop?category=cables",
    },
  ];

  return (
    <section className="w-full font-sans">
      {/* 1. MAIN HERO */}
      <div className="w-full bg-[#F4F5F7] dark:bg-[#1C2028]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex flex-col lg:flex-row items-center pt-16 lg:pt-24 pb-0 min-h-[550px] relative">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%] z-10 pb-16 lg:pb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#15181E] rounded-full text-[11px] font-bold text-gray-800 dark:text-[#D5D9E0] shadow-sm mb-6 border border-gray-100 dark:border-[#262C37]">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Premium Tech
            </div>
            
            <h1 className="text-[44px] md:text-[56px] lg:text-[68px] leading-[1.1] font-bold text-[#1A1A1A] dark:text-white tracking-tight mb-6">
              Smart Devices Built For<br />Smarter Living
            </h1>
            
            <p className="text-[15px] text-[#555] dark:text-gray-300 max-w-[480px] leading-relaxed mb-8 font-medium">
              Upgrade your home, work, and entertainment experience with premium gadgets, smart devices, and the latest technology at unbeatable prices.
            </p>
            
            <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-[#111] text-white px-8 py-4 rounded-md font-semibold text-[14px] hover:bg-black transition-colors shadow-lg shadow-black/10">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[45%] h-[400px] lg:h-auto relative lg:static flex justify-center lg:justify-end items-end pointer-events-none mt-8 lg:mt-0">
            {/* The image should sit flush with the bottom */}
            <div className="relative w-[120%] lg:w-[150%] max-w-[800px] aspect-square -mr-[10%] lg:-mr-[20%]">
               <Image 
                  src="/images/hero-gadgets.jpg"
                  alt="Premium Tech Accessories and Gadgets"
                  fill
                  className="object-contain object-bottom mix-blend-multiply"
                  priority
                />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3-COLUMN PROMO BANNERS */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCards.map((card, idx) => (
            <div key={idx} className="bg-[#F8F9FA] dark:bg-[#15181E] rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px] group border border-gray-100 dark:border-[#262C37]">
              
              <div className="z-10 relative w-[60%]">
                <div className="text-[10px] text-gray-500 dark:text-[#8A919C] font-bold mb-4 whitespace-pre-line leading-relaxed">
                  {card.kicker}
                </div>
                
                <div className="text-[11px] text-gray-500 dark:text-[#8A919C] font-bold mb-1">
                  {card.discount}
                </div>
                
                <h3 className="text-[20px] font-bold text-gray-900 dark:text-[#E9EBEF] leading-[1.2] mb-6 whitespace-pre-line">
                  {card.title}
                </h3>
                
                <Link href={card.link} className="inline-flex items-center gap-2 border border-gray-300 dark:border-[#3A4150] rounded-full px-5 py-2 text-[12px] font-bold text-gray-800 dark:text-[#D5D9E0] hover:bg-black hover:text-white hover:border-black transition-colors">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Right Side Product Image */}
              <div className="absolute right-0 bottom-0 top-0 w-[50%] flex items-center justify-end p-4">
                <div className="relative w-full h-[80%]">
                  <Image 
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}


