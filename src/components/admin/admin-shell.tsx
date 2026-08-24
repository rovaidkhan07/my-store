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
  Clock,
  ExternalLink,
  Shield,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, badge: null },
  { name: "Products", href: "/admin/products", icon: Package, badge: "Catalog" },
  { name: "Categories", href: "/admin/categories", icon: Layers, badge: null },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "Live" },
  { name: "Inventory", href: "/admin/inventory", icon: Boxes, badge: "Stock" },
  { name: "Store Settings", href: "/admin/settings", icon: Settings, badge: null },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col lg:flex-row relative selection:bg-[#FF5500] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient background lighting orbs */}
      <div className="fixed top-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-[#FF5500]/10 to-amber-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tl from-stone-200/50 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ================= SINGLE UNIFIED STICKY MOBILE TOP BAR ================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-slate-850 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-xs">
              MH
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm text-slate-950 leading-none">
                Mobile<span className="text-[#FF5500]">Hub</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-slate-700 hover:text-black transition-colors"
            title="View Store"
          >
            <Store className="w-4 h-4 text-[#FF5500]" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= DESKTOP FIXED SIDEBAR & MOBILE DRAWER ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-700 border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 shadow-xl lg:shadow-xs ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between">
            <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xs tracking-tight shadow-md group-hover:scale-105 transition-transform">
                MH
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-950 text-base tracking-tight leading-none">
                  Mobile<span className="text-[#FF5500]">Hub</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#FF5500]" /> Admin Suite
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-black hover:bg-stone-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
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
                    onClick={() => setIsSidebarOpen(false)}
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

          {/* Quick Database Status Box */}
          <div className="p-3.5 mx-4 mb-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Production DB Active</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Prisma Postgres connected with atomic stock synchronizer.
            </p>
            <Link
              href="/"
              target="_blank"
              className="w-full mt-1.5 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-black text-slate-800 hover:text-white border border-stone-200 hover:border-black text-[11px] font-bold transition-all shadow-2xs"
            >
              <Store className="w-3 h-3 text-[#FF5500]" />
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

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Desktop-only Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-stone-200 text-[11px] font-bold text-slate-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 font-normal">System:</span>
              <span className="text-emerald-700 font-bold">Online</span>
            </div>

            {time && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                <span className="font-bold text-slate-800">{time}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-[#FF5500] text-white text-xs font-bold transition-all shadow-md group"
            >
              <Store className="w-3.5 h-3.5 text-white" />
              <span>View Live Store</span>
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">
                MH
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 leading-tight">Admin User</span>
                <span className="text-[10px] text-[#FF5500] font-bold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> Super Admin
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body with Responsive Padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
