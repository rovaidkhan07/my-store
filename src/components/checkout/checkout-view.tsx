"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { checkoutSchema, PAKISTAN_MAJOR_CITIES } from "@/lib/validations/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
} from "lucide-react";

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    city: "Karachi",
    customCity: "",
    postalCode: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "bank_transfer",
  });

  const [isCustomCity, setIsCustomCity] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customerUser, setCustomerUser] = useState<{ id: string; name: string; email: string; phone?: string | null } | null>(null);

  React.useEffect(() => {
    const checkCustomer = async () => {
      try {
        const res = await fetch("/api/auth/customer/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCustomerUser(data.user);
          setFormData((prev) => ({
            ...prev,
            customerName: prev.customerName || data.user.name || "",
            customerEmail: prev.customerEmail || data.user.email || "",
            customerPhone: prev.customerPhone || data.user.phone || "",
          }));
        }
      } catch {
        // Guest checkout continues seamlessly
      }
    };
    checkCustomer();
  }, []);

  const isFreeDelivery = subtotal >= STORE_CONFIG.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : STORE_CONFIG.defaultDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateField = (name: string, value: string) => {
    const activeCity = isCustomCity ? formData.customCity : formData.city;
    const testData = {
      ...formData,
      [name]: value,
      city: name === "city" || name === "customCity" ? (isCustomCity ? value : formData.city) : activeCity,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
      })),
    };

    const result = checkoutSchema.safeParse(testData);
    if (!result.success) {
      const issues: any[] = (result.error as any).issues || (result.error as any).errors || [];
      const issue = issues.find((err: any) => err.path[0] === name);
      if (issue) {
        setFieldErrors((prev) => ({ ...prev, [name]: issue.message }));
        return false;
      }
    }

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    return true;
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const val = (formData as any)[field] ?? "";
    validateField(field, val);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const resolvedCity = isCustomCity ? formData.customCity.trim() : formData.city.trim();

    const payload = {
      idempotencyKey,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerEmail: formData.customerEmail.trim(),
      shippingAddress: formData.shippingAddress.trim(),
      city: resolvedCity,
      postalCode: formData.postalCode.trim(),
      notes: formData.notes.trim(),
      paymentMethod: formData.paymentMethod,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
      })),
    };

    // Client-side full schema validation
    const validation = checkoutSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      const issues: any[] = (validation.error as any).issues || (validation.error as any).errors || [];
      issues.forEach((err: any) => {
        const key = String(err.path[0]);
        if (key && !errors[key]) errors[key] = err.message;
      });

      // Mark all invalid fields as touched
      const touchedAll: Record<string, boolean> = {};
      Object.keys(errors).forEach((k) => (touchedAll[k] = true));
      setTouchedFields((prev) => ({ ...prev, ...touchedAll }));
      setFieldErrors(errors);
      setError(issues[0]?.message || "Please correct the highlighted form errors.");
      return;
    }

    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(data.error || "Failed to place order. Please check your details.");
      }

      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout error occurred";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-md w-full shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF6F0] flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Add items to your cart before proceeding to the checkout.
          </p>
          <Button asChild className="w-full bg-black hover:bg-[#FF5500] text-white rounded-xl text-xs font-bold h-11">
            <Link href="/shop">Browse Mobile Accessories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb */}
        <div>
          <div className="text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span className="mx-2 text-slate-400">/</span>
            <Link href="/cart" className="hover:text-slate-900">Cart</Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-900 font-bold">Secure Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Checkout &amp; Order Placement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Please enter your accurate Pakistani contact and delivery address to ensure fast delivery.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact & Delivery Info */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">Delivery Address</h2>
                    <span className="text-[11px] text-slate-400">Where should we deliver your parcel?</span>
                  </div>
                </div>

                {customerUser ? (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                        {customerUser.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Logged in as: </span>
                        <strong className="text-slate-900">{customerUser.name}</strong>{" "}
                        <span className="text-slate-400 font-mono">({customerUser.email})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Auto-Linked
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      Have a MobileHub account?
                    </span>
                    <Link
                      href="/login?redirect=/checkout"
                      className="font-bold text-[#FF5500] hover:underline"
                    >
                      Sign In &rarr;
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF5500]" /> Full Name *
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">First &amp; Last Name</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Rovaid or Ali Khan"
                      value={formData.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      onBlur={() => handleBlur("customerName")}
                      className={`h-11 rounded-xl text-xs bg-[#FAF6F0]/60 ${
                        touchedFields.customerName && fieldErrors.customerName
                          ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/40"
                          : "border-stone-200"
                      }`}
                    />
                    {touchedFields.customerName && fieldErrors.customerName && (
                      <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF5500]" /> Mobile Phone *
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">03XX XXXXXXX</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={formData.customerPhone}
                      onChange={(e) => handleChange("customerPhone", e.target.value)}
                      onBlur={() => handleBlur("customerPhone")}
                      className={`h-11 rounded-xl text-xs font-mono bg-[#FAF6F0]/60 ${
                        touchedFields.customerPhone && fieldErrors.customerPhone
                          ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/40"
                          : "border-stone-200"
                      }`}
                    />
                    {touchedFields.customerPhone && fieldErrors.customerPhone ? (
                      <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.customerPhone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400">
                        Rider will call this number for parcel delivery.
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">(Optional receipt)</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formData.customerEmail}
                      onChange={(e) => handleChange("customerEmail", e.target.value)}
                      onBlur={() => handleBlur("customerEmail")}
                      className={`h-11 rounded-xl text-xs bg-[#FAF6F0]/60 ${
                        touchedFields.customerEmail && fieldErrors.customerEmail
                          ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/40"
                          : "border-stone-200"
                      }`}
                    />
                    {touchedFields.customerEmail && fieldErrors.customerEmail && (
                      <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.customerEmail}
                      </p>
                    )}
                  </div>

                  {/* City Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5500]" /> City in Pakistan *
                    </label>
                    {!isCustomCity ? (
                      <div className="space-y-1.5">
                        <select
                          value={formData.city}
                          onChange={(e) => {
                            if (e.target.value === "OTHER_CITY") {
                              setIsCustomCity(true);
                              handleChange("city", "");
                            } else {
                              handleChange("city", e.target.value);
                            }
                          }}
                          className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-bold bg-[#FAF6F0]/60 text-slate-900 focus:outline-none focus:border-black"
                        >
                          {PAKISTAN_MAJOR_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c} {c === "Karachi" ? "(Same / Next Day)" : ""}
                            </option>
                          ))}
                          <option value="OTHER_CITY">+ Other City (Type manually)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          required
                          placeholder="Enter your city name"
                          value={formData.customCity}
                          onChange={(e) => handleChange("customCity", e.target.value)}
                          onBlur={() => handleBlur("customCity")}
                          className="h-11 rounded-xl text-xs bg-[#FAF6F0]/60 flex-1 border-stone-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCity(false);
                            handleChange("city", "Karachi");
                          }}
                          className="px-3 text-[11px] font-bold text-slate-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                        >
                          Select List
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Postal / ZIP Code</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Optional 5 digits)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 75500, 54000"
                      maxLength={5}
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleBlur("postalCode")}
                      className={`h-11 rounded-xl text-xs font-mono bg-[#FAF6F0]/60 ${
                        touchedFields.postalCode && fieldErrors.postalCode
                          ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/40"
                          : "border-stone-200"
                      }`}
                    />
                    {touchedFields.postalCode && fieldErrors.postalCode && (
                      <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.postalCode}
                      </p>
                    )}
                  </div>

                  {/* Complete Street Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF5500]" /> Complete Delivery Address *
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">House #, Street #, Sector / Area</span>
                    </label>
                    <Textarea
                      required
                      rows={3}
                      placeholder="e.g. House 14-B, Street 5, Phase 6 DHA (Near Main Market)"
                      value={formData.shippingAddress}
                      onChange={(e) => handleChange("shippingAddress", e.target.value)}
                      onBlur={() => handleBlur("shippingAddress")}
                      className={`rounded-xl text-xs bg-[#FAF6F0]/60 ${
                        touchedFields.shippingAddress && fieldErrors.shippingAddress
                          ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/40"
                          : "border-stone-200"
                      }`}
                    />
                    {touchedFields.shippingAddress && fieldErrors.shippingAddress ? (
                      <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.shippingAddress}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400">
                        Include landmarks, floor/flat numbers for hassle-free delivery.
                      </p>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Special Delivery Instructions
                      <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Call before coming, leave with security guard..."
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="h-11 rounded-xl text-xs bg-[#FAF6F0]/60 border-stone-200"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">Payment Method</h2>
                    <span className="text-[11px] text-slate-400">Choose how you wish to pay</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-black bg-[#FAF6F0]/40 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className="mt-1 w-4 h-4 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#FF5500]" /> Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Pay cash directly to the courier rider upon physical inspection of your parcel.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === "bank_transfer"
                        ? "border-black bg-[#FAF6F0]/40 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "bank_transfer" })}
                      className="mt-1 w-4 h-4 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#FF5500]" /> Direct Bank Transfer / Raast
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-full">
                          Meezan Bank
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Transfer directly via Banking App or Raast ID.
                      </p>

                      {/* Bank Details Dropdown when selected */}
                      {formData.paymentMethod === "bank_transfer" && (
                        <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 animate-in fade-in">
                          <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                            Bank Account Information
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-[#FAF6F0] border border-stone-200">
                              <span className="text-[10px] text-slate-400 block">Bank Name:</span>
                              <span className="font-bold text-slate-900">{STORE_CONFIG.bankDetails.bankName}</span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-[#FAF6F0] border border-stone-200">
                              <span className="text-[10px] text-slate-400 block">Account Title:</span>
                              <span className="font-bold text-slate-900">{STORE_CONFIG.bankDetails.accountTitle}</span>
                            </div>
                          </div>

                          {/* 1-Click Copy Buttons */}
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF6F0] border border-stone-200 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Account Number:</span>
                              <span className="font-bold text-slate-900 font-mono">
                                {STORE_CONFIG.bankDetails.accountNumber}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(STORE_CONFIG.bankDetails.accountNumber, "acc")}
                              className="h-7 text-[10px] font-bold"
                            >
                              {copiedField === "acc" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              {copiedField === "acc" ? "Copied" : "Copy"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Box */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
                <h2 className="text-base font-black text-slate-950 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{items.length} items</span>
                </h2>

                {/* Items List */}
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto space-y-2">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || "def"}`}
                      className="pt-2 flex items-center gap-3 text-xs"
                    >
                      <div className="relative w-12 h-12 rounded-xl bg-[#FAF6F0] border border-stone-200 overflow-hidden shrink-0">
                        <Image
                          src={
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                          }
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{item.name}</div>
                        {item.variantName && (
                          <div className="text-[#FF5500] text-[11px] font-semibold">{item.variantName}</div>
                        )}
                        <div className="text-slate-400 font-mono">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-black text-slate-900 shrink-0 font-mono">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Delivery Banner */}
                {isFreeDelivery && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free Nationwide Express Delivery unlocked!</span>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className={`font-bold font-mono ${isFreeDelivery ? "text-emerald-600" : "text-slate-900"}`}>
                      {isFreeDelivery ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-base font-black text-slate-950">
                    <span>Total Amount</span>
                    <span className="text-[#FF5500] text-lg font-mono">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-black hover:bg-[#FF5500] text-white rounded-full text-xs sm:text-sm font-black transition-all shadow-lg shadow-black/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying &amp; Placing Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Order ({formatPrice(grandTotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-slate-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>7-Day Replacement Guarantee • 100% Genuine Items</span>
                  </div>
                  <div>Parcels dispatched via Leopards Courier / TCS Pakistan</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
