"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  LogOut,
  Shield,
  Clock,
  ExternalLink,
  Zap,
} from "lucide-react";

export function AdminHeader() {
  const router = useRouter();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left side: System status & Live Clock */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-500 font-normal">System:</span>
          <span className="text-emerald-700 font-bold">Online</span>
        </div>

        {time && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 font-mono bg-background px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="font-bold text-gray-800">{time}</span>
          </div>
        )}
      </div>

      {/* Right side: Quick Links, Live Store, Admin profile */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-white text-white text-xs font-bold transition-all shadow-md hover:shadow-primary/25 group"
        >
          <Store className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">View Live Store</span>
          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs shadow-xs">
            MH
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-black text-gray-900 leading-tight">Admin User</span>
            <span className="text-[10px] text-accent font-bold flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> Super Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-sm text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}


