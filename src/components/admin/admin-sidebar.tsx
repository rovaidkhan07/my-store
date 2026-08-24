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
  Zap,
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
      <div className="lg:hidden bg-[#0A0D14] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5 font-bold">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-[#FF5500] flex items-center justify-center text-white shadow-md shadow-[#FF5500]/20">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm leading-tight text-white">MobileHub</span>
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0D14] text-slate-300 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-[#FF5500] to-rose-600 flex items-center justify-center text-white shadow-lg shadow-[#FF5500]/25 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-white text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0D14]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base tracking-tight">Mobile<span className="text-[#FF5500]">Hub</span></span>
                </div>
                <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Admin Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Nav List */}
          <div className="p-4 flex-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 pb-2.5">
              Management
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
                    className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/15 via-[#FF5500]/15 to-transparent text-white border border-[#FF5500]/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-amber-500 to-[#FF5500] text-white shadow-xs shadow-[#FF5500]/30"
                            : "bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800"
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
                            ? "bg-[#FF5500]/20 text-amber-300 border border-[#FF5500]/30"
                            : "bg-slate-900 text-slate-400 group-hover:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? "text-amber-400 translate-x-0.5"
                            : "text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Store Info Card */}
          <div className="p-4 mx-4 mb-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Production Store</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Prisma Postgres connection active. Orders &amp; stock sync in real-time.
            </p>
            <Link
              href="/"
              target="_blank"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-[#FF5500] text-slate-200 hover:text-white text-xs font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Visit Customer Store</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="p-4 border-t border-slate-800/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 transition-all cursor-pointer"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
