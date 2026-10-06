"use client";

import React from "react";
import Link from "next/link";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center p-2 ${pathname === '/' ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center p-2 ${pathname === '/shop' ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
          <Grid className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Shop</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center p-2 relative ${pathname === '/cart' ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Cart</span>
        </Link>
        <Link href="/account" className={`flex flex-col items-center p-2 ${pathname === '/account' ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
