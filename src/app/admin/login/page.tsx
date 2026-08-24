"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Lock,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#FF5500] selection:text-white overflow-hidden">
      {/* Glowing Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-[#FF5500]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-[#FF5500] to-rose-600 flex items-center justify-center text-white shadow-xl shadow-[#FF5500]/30 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="text-left">
            <span className="font-black text-2xl text-white tracking-tight">
              Mobile<span className="text-[#FF5500]">Hub</span>
            </span>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Executive Portal
            </div>
          </div>
        </Link>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
          Secure executive management console for inventory, sales, orders, and storefront configuration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-[#0B0E14]/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 shadow-md">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Admin Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 pl-10 rounded-2xl h-11"
                  placeholder="admin@mobilehub.pk"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 pl-10 rounded-2xl h-11 font-mono"
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
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <KeyRound className="w-3 h-3" /> Auto-fill Default Admin Creds
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold rounded-2xl shadow-xl shadow-[#FF5500]/25 cursor-pointer mt-3 transition-all text-xs"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
