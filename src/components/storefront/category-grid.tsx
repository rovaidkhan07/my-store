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
    <section className="bg-white py-16 font-sans">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">

        {/* Section Header (Nevixra Style) */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[11px] font-bold text-gray-800 shadow-sm mb-4 border border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Our Category
            </div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A1A1A] tracking-tight leading-none">
              Premium Gadget Series
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Circular Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.slice(0, 6).map((cat) => (
            <Link
              href={`/shop?category=${cat.slug}`}
              key={cat.id}
              className="flex flex-col items-center justify-center text-center w-full group cursor-pointer"
            >
              <div className="w-[140px] h-[140px] rounded-full bg-[#F8F9FA] overflow-hidden relative flex items-center justify-center mb-5 group-hover:shadow-md transition-shadow">
                 <Image
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400"}
                    alt={cat.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 text-center group-hover:text-black transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

