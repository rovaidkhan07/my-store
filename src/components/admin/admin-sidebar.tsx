"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, badge: null },
    { name: "Products", href: "/admin/products", icon: Package, badge: "Catalog" },
    { name: "Categories", href: "/admin/categories", icon: Layers, badge: null },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "Live" },
    { name: "Inventory", href: "/admin/inventory", icon: Boxes, badge: "Stock" },
    { name: "Store Settings", href: "/admin/settings", icon: Settings, badge: null },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-white text-slate-900 px-4 py-3.5 flex items-center justify-between border-b border-stone-200 sticky top-0 z-40 shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5 font-bold">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white text-xs font-black shadow-xs">
            MH
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm leading-tight text-slate-950">MobileHub</span>
            <span className="text-[9px] font-bold text-[#FF5500] uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl text-slate-700 hover:text-black bg-stone-100 border border-stone-200"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md text-slate-700 border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 shadow-xs ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo Header - Exactly matching Storefront */}
          <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xs tracking-tight shadow-md group-hover:scale-105 transition-transform">
                MH
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-950 text-base tracking-tight">
                    Mobile<span className="text-[#FF5500]">Hub</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#FF5500]" /> Admin Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="p-4 flex-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-2.5">
              Store Operations
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-black text-white shadow-md font-bold"
                        : "text-slate-600 hover:text-slate-950 hover:bg-stone-100/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#FAF8F5] text-slate-600 group-hover:text-black group-hover:bg-stone-200/70 border border-stone-200/60"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className={isActive ? "font-bold text-white" : ""}>
                        {item.name}
                      </span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#FF5500] text-white"
                            : "bg-stone-100 text-slate-600 group-hover:bg-stone-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? "text-[#FF5500] translate-x-0.5"
                            : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Store Info Card (Matching Storefront Warm Tone) */}
          <div className="p-4 mx-4 mb-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 p-3.5 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Production Database</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Prisma Postgres connected. Atomic order placements and live stock sync.
            </p>
            <Link
              href="/"
              target="_blank"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-white hover:bg-black text-slate-800 hover:text-white border border-stone-200 hover:border-black text-xs font-bold transition-all shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Visit Customer Store</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="p-4 border-t border-stone-200/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
