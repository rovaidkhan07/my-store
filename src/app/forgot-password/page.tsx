"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  // STEP 1: Request OTP code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/customer/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      if (data.demoOtp) {
        setDemoCodeHint(data.demoOtp);
        setOtpCode(data.demoOtp); // Auto-fill for convenience
      }

      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending reset code";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP and reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/customer/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          email,
          code: otpCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccessMessage(data.message || "Password reset successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reset failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#FF5500] selection:text-white">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#FF5500]/10 to-amber-300/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base shadow-md group-hover:scale-105 transition-transform">
            <span className="text-[#FF5500]">M</span>H
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-950">
            Mobile<span className="text-[#FF5500]">Hub</span>
          </span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto font-medium">
          {step === 1
            ? "Enter your registered email address to receive a secure 6-digit recovery code."
            : "Enter the 6-digit verification code and choose a new password for your account."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-stone-200/90 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
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

          {successMessage ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-950">Password Changed!</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {successMessage}
              </p>
              <Button
                asChild
                className="w-full h-12 bg-black hover:bg-[#FF5500] text-white font-bold rounded-full shadow-md mt-2"
              >
                <Link href="/login">Proceed to Sign In</Link>
              </Button>
            </div>
          ) : step === 1 ? (
            /* STEP 1: Enter Email */
            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Email Address *
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#FAF8F5] border-stone-200 text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 focus:bg-white text-xs"
                    placeholder="name@example.com"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-12 bg-black hover:bg-[#FF5500] text-white font-bold rounded-full shadow-md hover:shadow-[#FF5500]/25 cursor-pointer mt-3 transition-all duration-300 text-xs"
              >
                Send Verification OTP Code
              </Button>

              <div className="pt-4 border-t border-stone-100 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter OTP & New Password */
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              {demoCodeHint && (
                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-2xl flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#FF5500]" />
                    <span>Your OTP Code:</span>
                  </div>
                  <strong className="font-mono text-sm tracking-widest text-[#FF5500]">
                    {demoCodeHint}
                  </strong>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    className="bg-[#FAF8F5] border-stone-200 text-slate-900 text-center font-mono text-lg tracking-widest rounded-2xl h-12 focus:bg-white"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-[#FAF8F5] border-stone-200 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 rounded-2xl h-12 font-mono focus:bg-white text-xs"
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
                className="w-full h-12 bg-black hover:bg-[#FF5500] text-white font-bold rounded-full shadow-md hover:shadow-[#FF5500]/25 cursor-pointer mt-3 transition-all duration-300 text-xs"
              >
                Reset Password &amp; Update Account
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-black font-semibold"
                >
                  &larr; Resend code to another email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
