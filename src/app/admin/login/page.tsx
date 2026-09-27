"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mobilehub.pk");
  const [password, setPassword] = useState("admin123@MobileHub");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@mobilehub.pk");
    setPassword("admin123@MobileHub");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#FF5500] selection:text-white overflow-hidden">
      {/* Ambient Warm Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#FF5500]/15 to-amber-300/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        {/* Exact Storefront Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm tracking-tight shadow-md group-hover:scale-105 transition-transform">
            MH
            <span className="w-2 h-2 rounded-full bg-[#FF5500] ml-0.5 mb-2" />
          </div>
          <div className="text-left">
            <span className="font-black text-2xl text-slate-950 tracking-tight">
              Mobile<span className="text-[#FF5500]">Hub</span>
            </span>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FF5500]" /> Admin Suite
            </div>
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
          Admin Portal Login
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto font-medium">
          Secure executive management console for inventory, sales, orders, and storefront configuration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-white border border-stone-200/90 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Admin Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#FAF8F5] border-stone-200 text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 focus:bg-white"
                  placeholder="admin@mobilehub.pk"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#FAF8F5] border-stone-200 text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 font-mono focus:bg-white"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Quick Demo Autofill Pill */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-slate-700 hover:text-[#FF5500] flex items-center gap-1.5 cursor-pointer transition-colors bg-[#FAF8F5] border border-stone-200 px-3 py-1.5 rounded-full"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#FF5500]" /> Auto-fill Default Admin Creds
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 bg-black hover:bg-[#FF5500] text-white font-bold rounded-full shadow-md hover:shadow-[#FF5500]/25 cursor-pointer mt-3 transition-all duration-300 text-xs"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
