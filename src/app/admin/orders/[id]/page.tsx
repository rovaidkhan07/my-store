"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderWithDetails } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Truck,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Printer,
} from "lucide-react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setOrderStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
      }
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdate = async (e?: React.FormEvent, customStatus?: string) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    const nextStatus = customStatus || orderStatus;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: nextStatus,
          paymentStatus,
          notes: statusNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update order");
      }

      setUpdateMessage("Order status updated successfully!");
      setStatusNote("");
      if (customStatus) setOrderStatus(customStatus);
      fetchOrder();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setUpdateMessage(`Error: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
          <span>Loading order #{id}...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4 bg-[#0B0E14] border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <p className="text-xs text-slate-400">
          The requested order ID does not exist in the database.
        </p>
        <Button asChild variant="outline" className="bg-slate-900 border-slate-800 text-white rounded-xl">
          <Link href="/admin/orders">Back to Orders Catalog</Link>
        </Button>
      </div>
    );
  }

  const cleanPhone = order.customerPhone.replace(/\D/g, "");
  const customerWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${order.customerName},\nThis is MobileHub regarding your Order *${order.orderNumber}* (Total: ${formatPrice(order.total)}).\nYour current order status is: *${order.orderStatus.toUpperCase()}*.\nThank you for shopping with us!`
  )}`;

  const pipelineSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentStepIndex = pipelineSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Order Fulfillment View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Order</span>
              <span className="font-mono text-amber-400">#{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={customerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Message Customer on WhatsApp
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Slip
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Fulfillment Stepper */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Fulfillment Stage Pipeline
          </h2>
          <span className="text-xs font-bold font-mono text-amber-400 capitalize">
            Current: {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx && order.orderStatus !== "cancelled";
            const isCurrent = order.orderStatus === step;

            return (
              <button
                key={step}
                disabled={isUpdating}
                onClick={() => handleUpdate(undefined, step)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-gradient-to-br from-amber-500 to-[#FF5500] text-white border-[#FF5500] shadow-md shadow-[#FF5500]/25 font-bold"
                    : isCompleted
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/70"
                    : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  Step 0{idx + 1}
                </div>
                <div className="text-xs font-bold capitalize mt-0.5">{step}</div>
              </button>
            );
          })}
        </div>
      </div>

      {updateMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-md ${
            updateMessage.startsWith("Error")
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
          }`}
        >
          {updateMessage.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{updateMessage}</span>
        </div>
      )}

      {/* Main Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Details & Ordered Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" /> Customer &amp; Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  Customer Contact
                </div>
                <div className="text-sm font-bold text-white">{order.customerName}</div>
                <div className="text-amber-400 font-mono text-xs flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
                </div>
                {order.customerEmail && (
                  <div className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {order.customerEmail}
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  Delivery Address
                </div>
                <div className="text-white font-medium flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <span>{order.shippingAddress}</span>
                </div>
                <div className="text-slate-400 pl-5 font-semibold">
                  {order.city} {order.postalCode ? `(${order.postalCode})` : ""}
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  Customer Instructions / Delivery Note:
                </div>
                <p className="text-slate-300 text-xs whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Ordered Items Table */}
          <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <span>Ordered Products ({order.items.length})</span>
              <span className="text-slate-400 font-mono">Invoice Snapshot</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/40">
                    <th className="py-3 px-3">Product Name &amp; Spec</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3 text-center">Qty</th>
                    <th className="py-3 px-3">Unit Price</th>
                    <th className="py-3 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{item.productNameSnapshot}</div>
                        {item.variantSnapshot && (
                          <div className="text-amber-400 text-[11px] font-medium">
                            Variant: {item.variantSnapshot}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                        {item.skuSnapshot}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-white font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-mono">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-white font-mono">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Items</span>
                <span className="font-semibold text-white font-mono">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courier Delivery Fee</span>
                <span className="font-semibold text-white font-mono">
                  {order.deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE DELIVERY</span>
                  ) : (
                    formatPrice(order.deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Total Amount Due</span>
                <span className="text-amber-400 font-black font-mono text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Status Form */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={(e) => handleUpdate(e)}
            className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 space-y-5 text-xs shadow-lg"
          >
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800/80">
              Update Order Status &amp; Tracking
            </h2>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Fulfillment Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full h-11 px-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs"
              >
                <option value="pending">Pending (New Order)</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing &amp; Packing</option>
                <option value="shipped">Shipped with Courier</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled (Restore Stock)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Payment Verification
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-11 px-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs"
              >
                <option value="pending">Pending (Unverified)</option>
                <option value="paid">Paid (Receipt Verified)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Courier Tracking / Internal Notes
              </label>
              <Textarea
                placeholder="e.g. TCS Tracking #78901234 or Leopards Courier slip..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                className="bg-slate-900 border-slate-800 text-white rounded-2xl text-xs"
              />
            </div>

            <Button
              type="submit"
              isLoading={isUpdating}
              className="w-full bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold h-11 rounded-2xl shadow-lg shadow-[#FF5500]/25 gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" /> Save Status Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
