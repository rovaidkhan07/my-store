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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform &amp; Business Rules</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Store &amp; Business Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure business details, delivery rates, WhatsApp integration, and direct bank account information.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-md ${
            message.startsWith("Error")
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
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
        <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-lg">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Store Brand &amp; Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Storefront Name *
              </label>
              <Input
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Brand Tagline
              </label>
              <Input
                value={settings.store_tagline || ""}
                onChange={(e) => handleChange("store_tagline", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Helpline Contact Phone *
              </label>
              <Input
                value={settings.store_phone || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Number (with Country Code) *
              </label>
              <Input
                value={settings.store_whatsapp || ""}
                onChange={(e) => handleChange("store_whatsapp", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono rounded-xl h-11"
                placeholder="923001234567"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Official Support Email *
              </label>
              <Input
                value={settings.store_email || ""}
                onChange={(e) => handleChange("store_email", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5500]" /> Physical Store / Warehouse Address *
              </label>
              <Textarea
                value={settings.store_address || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                rows={2}
                className="bg-slate-900 border-slate-800 text-white rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Shipping Pricing */}
        <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-lg">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" /> Courier Delivery &amp; Shipping Rates (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider">
                Standard Courier Delivery Fee (PKR) *
              </label>
              <Input
                type="number"
                value={settings.delivery_fee || ""}
                onChange={(e) => handleChange("delivery_fee", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono text-base font-bold rounded-xl h-11"
              />
              <p className="text-[11px] text-slate-400">
                Applied automatically to orders below free shipping threshold.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider">
                Free Delivery Threshold (PKR) *
              </label>
              <Input
                type="number"
                value={settings.free_delivery_threshold || ""}
                onChange={(e) => handleChange("free_delivery_threshold", e.target.value)}
                className="bg-slate-900 border-slate-800 text-emerald-400 font-mono text-base font-bold rounded-xl h-11"
              />
              <p className="text-[11px] text-slate-400">
                Orders with subtotal exceeding this amount receive 100% Free Shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details & Customer Checkout Preview */}
        <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-lg">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Direct Bank Transfer Account (Checkout Display)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <Input
                value={settings.bank_name || ""}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
                placeholder="Meezan Bank Ltd."
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Account Title
              </label>
              <Input
                value={settings.bank_account_title || ""}
                onChange={(e) => handleChange("bank_account_title", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
                placeholder="MobileHub Technologies"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <Input
                value={settings.bank_account_number || ""}
                onChange={(e) => handleChange("bank_account_number", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono rounded-xl h-11"
                placeholder="01010102938485"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                IBAN Number
              </label>
              <Input
                value={settings.bank_iban || ""}
                onChange={(e) => handleChange("bank_iban", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono rounded-xl h-11"
                placeholder="PK92MEZN00010102938485"
              />
            </div>
          </div>

          {/* Live Customer Preview Box */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Customer Checkout View Preview
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Bank:</span>{" "}
                <strong className="text-white">{settings.bank_name || "Meezan Bank Ltd."}</strong>
              </div>
              <div>
                <span className="text-slate-500">Title:</span>{" "}
                <strong className="text-white">
                  {settings.bank_account_title || "MobileHub Technologies"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">A/C:</span>{" "}
                <strong className="text-amber-400">
                  {settings.bank_account_number || "01010102938485"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">IBAN:</span>{" "}
                <strong className="text-emerald-400">
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
            className="bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold px-8 h-12 rounded-2xl shadow-xl shadow-[#FF5500]/25 gap-2 text-xs cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save &amp; Deploy Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
