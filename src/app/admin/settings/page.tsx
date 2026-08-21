"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, CheckCircle, AlertCircle, Building2, Truck, MessageCircle } from "lucide-react";

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

      setMessage("Store settings updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setMessage(`Error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500 text-xs">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" /> Store &amp; Business Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure business details, delivery rates, WhatsApp integration, and bank accounts.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            message.startsWith("Error")
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Information */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
            Store Identity &amp; Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Store Name *
              </label>
              <Input
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Tagline
              </label>
              <Input
                value={settings.store_tagline || ""}
                onChange={(e) => handleChange("store_tagline", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Contact Phone *
              </label>
              <Input
                value={settings.store_phone || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                WhatsApp Business Number (with Country Code) *
              </label>
              <Input
                value={settings.store_whatsapp || ""}
                onChange={(e) => handleChange("store_whatsapp", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono"
                placeholder="923001234567"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Support Email Address *
              </label>
              <Input
                value={settings.store_email || ""}
                onChange={(e) => handleChange("store_email", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Physical Store Address *
              </label>
              <Textarea
                value={settings.store_address || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                rows={2}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Shipping Pricing */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" /> Shipping &amp; Delivery Rates (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Flat Rate Delivery Fee (PKR) *
              </label>
              <Input
                type="number"
                value={settings.delivery_fee || ""}
                onChange={(e) => handleChange("delivery_fee", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Free Delivery Threshold (PKR) *
              </label>
              <Input
                type="number"
                value={settings.free_delivery_threshold || ""}
                onChange={(e) => handleChange("free_delivery_threshold", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Bank Transfer Account (Checkout Display)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Bank Name
              </label>
              <Input
                value={settings.bank_name || ""}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Account Title
              </label>
              <Input
                value={settings.bank_account_title || ""}
                onChange={(e) => handleChange("bank_account_title", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Account Number
              </label>
              <Input
                value={settings.bank_account_number || ""}
                onChange={(e) => handleChange("bank_account_number", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                IBAN
              </label>
              <Input
                value={settings.bank_iban || ""}
                onChange={(e) => handleChange("bank_iban", e.target.value)}
                className="bg-slate-900 border-slate-800 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving} className="bg-blue-600 hover:bg-blue-700 font-bold px-8 h-11 text-xs gap-2">
            <Save className="w-4 h-4" /> Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
