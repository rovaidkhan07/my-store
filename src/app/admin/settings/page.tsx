"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Truck,
  MessageCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings || {});
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage("Store settings updated and applied across the platform!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setMessage(`Error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
          <span>Loading store settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-bold text-slate-800 shadow-2xs mb-1">
          <Settings className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Platform &amp; Business Rules</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
          Store &amp; Business Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Configure business details, delivery rates, WhatsApp integration, and direct bank account information.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm ${
            message.startsWith("Error")
              ? "bg-rose-50 border border-rose-200 text-rose-800"
              : "bg-emerald-50 border border-emerald-200 text-emerald-800"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Information */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5500]" /> Store Brand &amp; Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Storefront Name *
              </label>
              <Input
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Brand Tagline
              </label>
              <Input
                value={settings.store_tagline || ""}
                onChange={(e) => handleChange("store_tagline", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-900" /> Helpline Contact Phone *
              </label>
              <Input
                value={settings.store_phone || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Number (with Country Code) *
              </label>
              <Input
                value={settings.store_whatsapp || ""}
                onChange={(e) => handleChange("store_whatsapp", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 font-mono rounded-2xl h-11 focus:bg-white"
                placeholder="923001234567"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-900" /> Official Support Email *
              </label>
              <Input
                value={settings.store_email || ""}
                onChange={(e) => handleChange("store_email", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5500]" /> Physical Store / Warehouse Address *
              </label>
              <Textarea
                value={settings.store_address || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                rows={2}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Shipping Pricing */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-900" /> Courier Delivery &amp; Shipping Rates (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <label className="block text-slate-800 font-bold uppercase tracking-wider">
                Standard Courier Delivery Fee (PKR) *
              </label>
              <Input
                type="number"
                value={settings.delivery_fee || ""}
                onChange={(e) => handleChange("delivery_fee", e.target.value)}
                className="bg-white border-stone-200 text-slate-950 font-mono text-base font-bold rounded-2xl h-11"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Applied automatically to orders below the free shipping threshold.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <label className="block text-slate-800 font-bold uppercase tracking-wider">
                Free Delivery Threshold (PKR) *
              </label>
              <Input
                type="number"
                value={settings.free_delivery_threshold || ""}
                onChange={(e) => handleChange("free_delivery_threshold", e.target.value)}
                className="bg-white border-stone-200 text-emerald-700 font-mono text-base font-bold rounded-2xl h-11"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Orders with subtotal exceeding this amount receive 100% Free Shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details & Customer Checkout Preview */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-900" /> Direct Bank Transfer Account (Checkout Display)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <Input
                value={settings.bank_name || ""}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
                placeholder="Meezan Bank Ltd."
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Account Title
              </label>
              <Input
                value={settings.bank_account_title || ""}
                onChange={(e) => handleChange("bank_account_title", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
                placeholder="MobileHub Technologies"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <Input
                value={settings.bank_account_number || ""}
                onChange={(e) => handleChange("bank_account_number", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 font-mono rounded-2xl h-11 focus:bg-white"
                placeholder="01010102938485"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                IBAN Number
              </label>
              <Input
                value={settings.bank_iban || ""}
                onChange={(e) => handleChange("bank_iban", e.target.value)}
                className="bg-[#FAF8F5] border-stone-200 text-slate-900 font-mono rounded-2xl h-11 focus:bg-white"
                placeholder="PK92MEZN00010102938485"
              />
            </div>
          </div>

          {/* Live Customer Preview Box */}
          <div className="pt-3 border-t border-stone-100">
            <div className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#FF5500]" /> Customer Checkout View Preview
            </div>
            <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-1.5 font-mono text-xs text-slate-700">
              <div>
                <span className="text-slate-400">Bank:</span>{" "}
                <strong className="text-slate-950">{settings.bank_name || "Meezan Bank Ltd."}</strong>
              </div>
              <div>
                <span className="text-slate-400">Title:</span>{" "}
                <strong className="text-slate-950">
                  {settings.bank_account_title || "MobileHub Technologies"}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">A/C:</span>{" "}
                <strong className="text-slate-950 font-bold">
                  {settings.bank_account_number || "01010102938485"}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">IBAN:</span>{" "}
                <strong className="text-[#FF5500] font-bold">
                  {settings.bank_iban || "PK92MEZN00010102938485"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSaving}
            className="bg-black hover:bg-[#FF5500] text-white font-bold px-8 h-12 rounded-full shadow-md hover:shadow-[#FF5500]/25 gap-2 text-xs cursor-pointer transition-all duration-300"
          >
            <Save className="w-4 h-4" /> Save &amp; Deploy Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
