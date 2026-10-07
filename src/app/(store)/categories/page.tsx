import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/services/categoryService";
import { ArrowRight, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories | Kharidly",
  description: "Browse all mobile accessories categories: chargers, cables, power banks, covers, and audio gear.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Find the exact mobile accessory tailored to your phone model and charging needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const count = category._count?.products ?? 0;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-orange-600/60 p-5 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 w-full rounded-2xl bg-slate-100 overflow-hidden mb-4 border border-slate-100">
                    <Image
                      src={
                        category.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
                      }
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {count} {count === 1 ? "Product Available" : "Products Available"}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

