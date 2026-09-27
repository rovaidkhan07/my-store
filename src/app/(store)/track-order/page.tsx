"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { STORE_CONFIG, buildWhatsAppOrderSupportUrl } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PackageSearch,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { OrderWithDetails } from "@/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (trackingToken: string) => {
    if (!trackingToken.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: trackingToken.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || "No order found matching that secure token.");
      }
    } catch {
      setError("Failed to track order. Please try again or reach out on WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      fetchOrder(initialToken);
    }
  }, [initialToken]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(token);
  };

  const steps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Packed & Processing", icon: PackageSearch },
    { key: "shipped", label: "Shipped with Courier", icon: Truck },
    { key: "delivered", label: "Delivered", icon: PackageCheck },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === "cancelled") return "cancelled";
    if (stepIndex <= currentIndex) return "completed";
    return "upcoming";
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Track Form Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Enter your secure tracking token (sent to you after checkout) to view live shipment progress.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Secure Tracking Token *
              </label>
              <Input
                placeholder="e.g. 8f6b..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-md cursor-pointer"
            >
              Track Order Status
            </Button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Not Found:</strong> {error}
            </div>
          </div>
        )}

        {/* Order Results */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in-50">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Order Reference</span>
                <h2 className="text-xl font-bold text-slate-900 font-mono">{order.orderNumber}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  Status: {order.orderStatus}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                Fulfillment Timeline
              </h3>

              {order.orderStatus === "cancelled" ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="font-bold">This order has been cancelled</div>
                    <div className="text-xs text-rose-600 mt-0.5">Please contact customer support on WhatsApp for queries.</div>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2">
                  {steps.map((s) => {
                    const status = getStepStatus(s.key, order.orderStatus);
                    const Icon = s.icon;
                    const isDone = status === "completed";

                    return (
                      <div key={s.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isDone
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? "text-slate-900 font-bold" : "text-slate-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Items & Totals */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Items in this Order
              </h3>
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{item.productNameSnapshot}</span>
                      {item.variantSnapshot && (
                        <span className="text-slate-500 ml-2">({item.variantSnapshot})</span>
                      )}
                      <span className="text-slate-400 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-lg text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Direct Support Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Need help or address changes?</span>
              <a
                href={buildWhatsAppOrderSupportUrl(order.orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Order Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 text-xs">Loading order lookup...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
