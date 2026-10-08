"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryWithCount } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#15181E] py-16 font-sans">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">

        {/* Section Header (Nevixra Style) */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#15181E] rounded-full text-xs font-bold text-gray-800 dark:text-[#D5D9E0] shadow-sm mb-4 border border-gray-100 dark:border-[#262C37]">
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
              Our Category
            </div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              Premium Gadget Series
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-[#262C37] flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white dark:hover:border-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-[#262C37] flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white dark:hover:border-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 gap-4 md:grid-cols-3 lg:grid-cols-6 md:gap-8 pb-4 md:pb-0">
          {categories.slice(0, 6).map((cat) => (
            <Link
              href={`/shop?category=${cat.slug}`}
              key={cat.id}
              className="flex flex-col items-center justify-center text-center group cursor-pointer min-w-[140px] md:min-w-0 w-[140px] md:w-full snap-start"
            >
              <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full bg-[#F8F9FA] dark:bg-[#1C2028] overflow-hidden relative flex items-center justify-center mb-4 md:mb-5 group-hover:shadow-md transition-shadow">
                 <Image
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400"}
                    alt={cat.name}
                    fill
                    className="object-contain p-5 md:p-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                  />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-[#E9EBEF] text-center group-hover:text-black dark:group-hover:text-white transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}





