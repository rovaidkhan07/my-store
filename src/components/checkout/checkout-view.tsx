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
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
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
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);

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

  if (!isMounted) return null;
  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen py-16 flex items-center justify-center p-4">
        <div className="bg-background rounded-[24px] border border-border p-8 sm:p-12 text-center max-w-md w-full shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-[20px] bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Add items to your cart before proceeding to the checkout.
          </p>
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-white rounded-full text-xs font-black h-12 uppercase tracking-widest mt-4">
            <Link href="/shop">Browse Accessories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb */}
        <div>
          <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2 text-border">/</span>
            <Link href="/cart" className="hover:text-foreground">Cart</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-foreground">Secure Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tighter">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Please enter your accurate delivery address to ensure fast delivery.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-[16px] bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3 animate-in fade-in uppercase tracking-wider">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact & Delivery Info */}
              <div className="bg-background p-6 sm:p-8 rounded-[24px] border border-border shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-10 h-10 rounded-[12px] bg-primary text-background flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-tighter">Delivery Address</h2>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Where should we deliver your parcel?</span>
                  </div>
                </div>

                {customerUser ? (
                  <div className="p-4 rounded-[16px] bg-secondary border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-black text-xs">
                        {customerUser.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">Logged in as</span>
                        <strong className="text-foreground text-sm font-black uppercase">{customerUser.name}</strong>{" "}
                        <span className="text-muted-foreground font-mono">({customerUser.email})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-green-600 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      Auto-Linked
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-[16px] bg-secondary border border-border flex items-center justify-between text-xs">
                    <span className="text-foreground font-bold uppercase tracking-wider">
                      Have a Kharidly account?
                    </span>
                    <Link
                      href="/login?redirect=/checkout"
                      className="font-black text-primary hover:underline uppercase tracking-widest"
                    >
                      Sign In &rarr;
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> Full Name *
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold">First &amp; Last Name</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Rovaid or Ali Khan"
                      value={formData.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      onBlur={() => handleBlur("customerName")}
                      className={`h-12 rounded-[12px] text-sm bg-secondary ${
                        touchedFields.customerName && fieldErrors.customerName
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5"
                          : "border-border focus-visible:ring-primary"
                      }`}
                    />
                    {touchedFields.customerName && fieldErrors.customerName && (
                      <p className="text-xs text-destructive font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> Mobile Phone *
                      </span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={formData.customerPhone}
                      onChange={(e) => handleChange("customerPhone", e.target.value)}
                      onBlur={() => handleBlur("customerPhone")}
                      className={`h-12 rounded-[12px] text-sm font-mono bg-secondary ${
                        touchedFields.customerPhone && fieldErrors.customerPhone
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5"
                          : "border-border focus-visible:ring-primary"
                      }`}
                    />
                    {touchedFields.customerPhone && fieldErrors.customerPhone ? (
                      <p className="text-xs text-destructive font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.customerPhone}
                      </p>
                    ) : (
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Rider will call this number.
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold">(Optional)</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formData.customerEmail}
                      onChange={(e) => handleChange("customerEmail", e.target.value)}
                      onBlur={() => handleBlur("customerEmail")}
                      className={`h-12 rounded-[12px] text-sm bg-secondary ${
                        touchedFields.customerEmail && fieldErrors.customerEmail
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5"
                          : "border-border focus-visible:ring-primary"
                      }`}
                    />
                    {touchedFields.customerEmail && fieldErrors.customerEmail && (
                      <p className="text-xs text-destructive font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.customerEmail}
                      </p>
                    )}
                  </div>

                  {/* City Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> City in Pakistan *
                    </label>
                    {!isCustomCity ? (
                      <div className="space-y-2">
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
                          className="w-full h-12 px-4 rounded-[12px] border border-border text-sm font-bold bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                          className="h-12 rounded-[12px] text-sm bg-secondary flex-1 border-border focus-visible:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCity(false);
                            handleChange("city", "Karachi");
                          }}
                          className="px-4 text-xs font-black uppercase tracking-widest text-foreground bg-secondary border border-border hover:bg-border rounded-[12px] cursor-pointer transition-colors"
                        >
                          Select List
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                      <span>Postal / ZIP Code</span>
                      <span className="text-[10px] text-muted-foreground font-bold">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 75500, 54000"
                      maxLength={5}
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleBlur("postalCode")}
                      className={`h-12 rounded-[12px] text-sm font-mono bg-secondary ${
                        touchedFields.postalCode && fieldErrors.postalCode
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5"
                          : "border-border focus-visible:ring-primary"
                      }`}
                    />
                    {touchedFields.postalCode && fieldErrors.postalCode && (
                      <p className="text-xs text-destructive font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.postalCode}
                      </p>
                    )}
                  </div>

                  {/* Complete Street Address */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Complete Address *
                      </span>
                    </label>
                    <Textarea
                      required
                      rows={3}
                      placeholder="e.g. House 14-B, Street 5, Phase 6 DHA (Near Main Market)"
                      value={formData.shippingAddress}
                      onChange={(e) => handleChange("shippingAddress", e.target.value)}
                      onBlur={() => handleBlur("shippingAddress")}
                      className={`rounded-[12px] text-sm bg-secondary p-4 ${
                        touchedFields.shippingAddress && fieldErrors.shippingAddress
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5"
                          : "border-border focus-visible:ring-primary"
                      }`}
                    />
                    {touchedFields.shippingAddress && fieldErrors.shippingAddress ? (
                      <p className="text-xs text-destructive font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.shippingAddress}
                      </p>
                    ) : (
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Include landmarks, floor/flat numbers for hassle-free delivery.
                      </p>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Delivery Instructions
                      <span className="text-[10px] text-muted-foreground font-bold">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Call before coming, leave with security guard..."
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="h-12 rounded-[12px] text-sm bg-secondary border-border focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-background p-6 sm:p-8 rounded-[24px] border border-border shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-10 h-10 rounded-[12px] bg-primary text-background flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-tighter">Payment Method</h2>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Choose how you wish to pay</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-[16px] border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-tight">
                          <Truck className="w-5 h-5 text-primary" /> Cash on Delivery
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-500/10 px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        Pay cash directly to the courier rider upon delivery of your parcel.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-[16px] border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === "bank_transfer"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "bank_transfer" })}
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-tight">
                          <Building2 className="w-5 h-5 text-primary" /> Bank Transfer
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground bg-secondary border border-border px-3 py-1 rounded-full">
                          Prepaid
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        Transfer securely via Banking App or Raast ID.
                      </p>

                      {/* Bank Details Dropdown when selected */}
                      {formData.paymentMethod === "bank_transfer" && (
                        <div className="mt-5 p-5 rounded-[16px] bg-background border border-border space-y-4 animate-in fade-in">
                          <div className="text-xs font-black uppercase tracking-widest text-foreground">
                            Bank Information
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="p-4 rounded-[12px] bg-secondary border border-border/50">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Bank Name:</span>
                              <span className="font-black text-foreground uppercase">{STORE_CONFIG.bankDetails.bankName}</span>
                            </div>

                            <div className="p-4 rounded-[12px] bg-secondary border border-border/50">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Account Title:</span>
                              <span className="font-black text-foreground uppercase">{STORE_CONFIG.bankDetails.accountTitle}</span>
                            </div>
                          </div>

                          {/* 1-Click Copy Buttons */}
                          <div className="flex items-center justify-between p-4 rounded-[12px] bg-secondary border border-border/50">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Account Number:</span>
                              <span className="font-black text-foreground font-mono text-base">
                                {STORE_CONFIG.bankDetails.accountNumber}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(STORE_CONFIG.bankDetails.accountNumber, "acc")}
                              className="h-10 px-4 text-xs font-black uppercase tracking-widest rounded-full bg-background hover:bg-border border-border text-foreground"
                            >
                              {copiedField === "acc" ? <Check className="w-4 h-4 text-green-600 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
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
              <div className="bg-background p-6 sm:p-8 rounded-[24px] border border-border shadow-xs space-y-6">
                <h2 className="text-lg font-black text-foreground pb-4 border-b border-border flex items-center justify-between uppercase tracking-tighter">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-muted-foreground font-mono">{items.length} items</span>
                </h2>

                {/* Items List */}
                <div className="divide-y divide-border/50 max-h-72 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || "def"}`}
                      className="pt-3 flex items-center gap-4 text-sm"
                    >
                      <div className="relative w-16 h-16 rounded-[12px] bg-secondary border border-border overflow-hidden shrink-0">
                        <Image
                          src={
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                          }
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-foreground uppercase tracking-tight truncate text-xs">{item.name}</div>
                        {item.variantName && (
                          <div className="text-primary text-[10px] font-bold uppercase tracking-widest mt-0.5">{item.variantName}</div>
                        )}
                        <div className="text-muted-foreground font-mono text-[11px] font-bold mt-1">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-black text-foreground shrink-0 font-mono">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Delivery Banner */}
                {isFreeDelivery && (
                  <div className="p-4 rounded-[12px] bg-green-500/10 border border-green-500/20 text-green-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <span>Free Delivery Unlocked!</span>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-border space-y-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Delivery Fee</span>
                    <span className={`font-mono ${isFreeDelivery ? "text-green-600" : "text-foreground"}`}>
                      {isFreeDelivery ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-base font-black text-foreground uppercase tracking-tighter">
                    <span>Total Amount</span>
                    <span className="text-primary text-2xl font-mono leading-none">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary hover:bg-accent text-primary-foreground rounded-full text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 cursor-pointer flex items-center justify-center gap-3 mt-4"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Order</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="pt-4 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>7-Day Replacement • 100% Genuine</span>
                  </div>
                  <div>Nationwide Courier Partners</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}



