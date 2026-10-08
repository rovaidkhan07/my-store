"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TechFeaturesSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full font-sans bg-white dark:bg-[#15181E] pt-4 pb-16">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Banner - Dark */}
          <div className="bg-[#1C1F22] rounded-xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center min-h-[360px] group text-white">
            <div className="z-10 relative w-[60%] lg:w-[50%]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white mb-6 backdrop-blur-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#15181E]"></span>
                5 Years Warranty
              </div>
              
              <h3 className="text-[24px] lg:text-[28px] font-bold leading-[1.2] mb-4">
                Swift book laptop built to perform
              </h3>
              
              <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed">
                Enjoy a smooth and secure shopping experience with simple
              </p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-[18px] font-bold">$35.00</span>
                <span className="text-sm text-gray-500 dark:text-[#8A919C] line-through">$95.00</span>
              </div>
              
              <Link href="/shop" className="inline-flex items-center justify-center bg-white dark:bg-[#15181E] text-black dark:text-white px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-gray-100 dark:bg-[#1C2028] transition-colors">
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="absolute right-0 bottom-0 top-0 w-[50%] lg:w-[60%] flex items-center justify-end">
              <div className="relative w-[120%] h-[120%] mr-[-10%] mb-[-10%]">
                <Image 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
                  alt="Swift book laptop"
                  fill
                  className="object-cover object-left-bottom rounded-tl-3xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right Banner - Light */}
          <div className="bg-[#F8F9FA] dark:bg-[#1C2028] border border-gray-100 dark:border-[#262C37] rounded-xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center min-h-[360px] group">
            <div className="z-10 relative w-[60%] lg:w-[55%]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#15181E] rounded-full text-[10px] font-bold text-gray-800 dark:text-[#D5D9E0] shadow-sm mb-6 border border-gray-100 dark:border-[#262C37]">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
                Best Seller
              </div>
              
              <h3 className="text-[24px] lg:text-[28px] font-bold text-gray-900 dark:text-[#E9EBEF] leading-[1.2] mb-4">
                Sounds LX is here, hear the hype
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-[#8A919C] mb-6 font-medium leading-relaxed">
                Enjoy a smooth and secure shopping experience with simple
              </p>

              {/* Countdown Timer */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-bold text-gray-900 dark:text-[#E9EBEF]">{timeLeft.days}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8A919C] uppercase font-semibold">Days</span>
                </div>
                <span className="text-xl font-bold text-gray-300 pb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-bold text-gray-900 dark:text-[#E9EBEF]">{timeLeft.hours}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8A919C] uppercase font-semibold">Hrs</span>
                </div>
                <span className="text-xl font-bold text-gray-300 pb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-bold text-gray-900 dark:text-[#E9EBEF]">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8A919C] uppercase font-semibold">Min</span>
                </div>
                <span className="text-xl font-bold text-gray-300 pb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-bold text-gray-900 dark:text-[#E9EBEF]">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8A919C] uppercase font-semibold">Sec</span>
                </div>
              </div>
              
              <Link href="/shop" className="inline-flex items-center justify-center bg-gray-950 text-white px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-black transition-colors">
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="absolute right-0 bottom-0 top-0 w-[50%] lg:w-[45%] flex justify-end items-end pointer-events-none">
              <div className="relative w-[130%] aspect-[3/4] mb-[-5%] mr-[-5%]">
                <Image 
                  src="/images/hero-earbuds-girl-v2.jpg"
                  alt="Sounds LX hype"
                  fill
                  className="object-contain object-bottom mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



