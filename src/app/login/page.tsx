"use client";

import React, { useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      if (data.user?.role === "admin" && (!searchParams.get("redirect") || redirectUrl === "/account")) {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(
    (data: { user: { role: string } }) => {
      setError(null);
      setIsGoogleLoading(false);
      if (data.user?.role === "admin" && (!searchParams.get("redirect") || redirectUrl === "/account")) {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    },
    [router, redirectUrl, searchParams]
  );

  const handleGoogleError = useCallback((err: Error) => {
    setError(err.message || "Google Sign-In failed");
    setIsGoogleLoading(false);
  }, []);

  return (
    <div className="min-h-[85vh] bg-background text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-primary selection:text-white">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-primary/10 to-amber-300/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center mb-6 group">
          <img src="/logo/kharidly-logo.png" alt="Kharidly" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
          Customer Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto font-medium">
          Access your orders, live courier tracking, saved delivery addresses, and exclusive member discounts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-border/90 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-2xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google Sign In Button — real Google OAuth */}
          <div onClick={() => setIsGoogleLoading(true)}>
            <GoogleSignInButton
              text="signin_with"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              or sign in with email
            </span>
            <div className="border-t border-border w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 focus:bg-white text-xs"
                  placeholder="name@example.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Password *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-border text-slate-900 placeholder:text-slate-400 pl-10 pr-10 rounded-2xl h-12 font-mono focus:bg-white text-xs"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-accent hover:text-white font-bold rounded-full shadow-md hover:shadow-primary/25 cursor-pointer mt-3 transition-all duration-300 text-xs"
            >
              Sign In to My Account
            </Button>
          </form>

          {/* Footer Register Link */}
          <div className="pt-4 border-t border-stone-100 text-center space-y-3">
            <p className="text-xs text-slate-600 font-medium">
              Don&apos;t have an account yet?{" "}
              <Link
                href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="font-bold text-accent hover:underline"
              >
                Sign Up Now
              </Link>
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-black transition-colors"
            >
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-500">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}





