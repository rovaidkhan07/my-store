"use client";

import React, { useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  // Step 1 = Form Details, Step 2 = Email Verification OTP
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification Step state
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // STEP 1: Submit Details & Request Email Verification OTP
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "init",
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setStep(2);
      startResendTimer();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify 6-digit Code & Complete Registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email,
          code: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccessInfo("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid verification code";
      setError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP code to customer's email
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);

    try {
      const res = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend", email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code");

      startResendTimer();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Resend failed";
      setError(msg);
    }
  };

  const startResendTimer = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Google Sign Up — real Google OAuth via GoogleSignInButton
  const handleGoogleSuccess = useCallback(
    () => {
      setError(null);
      setIsGoogleLoading(false);
      router.push(redirectUrl);
      router.refresh();
    },
    [router, redirectUrl]
  );

  const handleGoogleError = useCallback((err: Error) => {
    setError(err.message || "Google Sign-Up failed");
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
          {step === 1 ? "Create Customer Account" : "Verify Your Email"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto font-medium">
          {step === 1
            ? "Join Kharidly to save addresses, track live courier deliveries, and receive exclusive tech deals."
            : `We have sent a 6-digit confirmation code to ${email}. Please enter it below to verify your account.`}
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

          {successInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successInfo}</span>
            </motion.div>
          )}

          {step === 1 ? (
            /* STEP 1: Registration Form */
            <>
              {/* Google Sign Up Button — real Google OAuth */}
              <div onClick={() => setIsGoogleLoading(true)}>
                <GoogleSignInButton
                  text="signup_with"
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-border w-full" />
                <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  or register with email
                </span>
                <div className="border-t border-border w-full" />
              </div>

              {/* Form */}
              <form onSubmit={handleInitiateRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-background border-border text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 focus:bg-white text-xs"
                      placeholder="Muhammad Rovaid"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (Will receive 6-digit code) *
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
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background border-border text-slate-900 placeholder:text-slate-400 pl-10 rounded-2xl h-12 font-mono focus:bg-white text-xs"
                      placeholder="0300 1234567"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password (min 6 characters) *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
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
                  Continue &amp; Send Verification Email &rarr;
                </Button>
              </form>

              {/* Footer Login Link */}
              <div className="pt-4 border-t border-stone-100 text-center space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Already have an account?{" "}
                  <Link
                    href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="font-bold text-accent hover:underline"
                  >
                    Sign In
                  </Link>
                </p>

                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-black transition-colors"
                >
                  &larr; Return to Storefront
                </Link>
              </div>
            </>
          ) : (
            /* STEP 2: Email Verification OTP Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
              <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-accent rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
                <Mail className="w-7 h-7" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Email Code
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    className="bg-background border-border text-slate-900 text-center font-mono text-xl tracking-widest rounded-2xl h-14 focus:bg-white"
                    placeholder="123456"
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center mt-2 font-medium">
                  Please check your inbox at <strong className="text-slate-900">{email}</strong> for your 6-digit confirmation code.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isVerifying}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-accent hover:text-white font-bold rounded-full shadow-md hover:shadow-primary/25 cursor-pointer transition-all duration-300 text-xs"
              >
                Verify Email &amp; Complete Sign Up
              </Button>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={`font-bold transition-colors cursor-pointer ${
                    resendCooldown > 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-accent hover:underline"
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email Code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-500">
          Loading sign up...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}



