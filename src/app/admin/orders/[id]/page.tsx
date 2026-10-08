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
      <div className="py-24 text-center text-gray-500 text-xs">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>Loading order #{id}...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4 bg-white border border-gray-200 rounded-sm p-8 max-w-md mx-auto shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-gray-950">Order not found</h2>
        <p className="text-xs text-gray-500 font-medium">
          The requested order ID does not exist in the database.
        </p>
        <Button asChild variant="outline" className="bg-white border-gray-200 text-gray-900 rounded-full">
          <Link href="/admin/orders">Back to Orders Catalog</Link>
        </Button>
      </div>
    );
  }

  const cleanPhone = order.customerPhone.replace(/\D/g, "");
  const customerWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${order.customerName},\nThis is Kharidly regarding your Order *${order.orderNumber}* (Total: ${formatPrice(order.total)}).\nYour current order status is: *${order.orderStatus.toUpperCase()}*.\nThank you for shopping with us!`
  )}`;

  const pipelineSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentStepIndex = pipelineSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black mb-3 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-accent" />
              <span>Order Fulfillment View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight flex flex-wrap items-center gap-2">
              <span>Order</span>
              <span className="font-mono text-accent">#{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={customerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Message on WhatsApp
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white hover:bg-secondary text-gray-800 px-5 py-2.5 rounded-full text-xs font-bold border border-gray-200 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4" /> Print Slip
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Fulfillment Stepper */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Fulfillment Stage Pipeline
          </h2>
          <span className="text-xs font-bold font-mono text-accent uppercase">
            Stage: {order.orderStatus}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx && order.orderStatus !== "cancelled";
            const isCurrent = order.orderStatus === step;

            return (
              <button
                key={step}
                disabled={isUpdating}
                onClick={() => handleUpdate(undefined, step)}
                className={`p-3.5 sm:p-4 rounded-sm sm:rounded-sm border text-center transition-all cursor-pointer shrink-0 min-w-[110px] sm:min-w-0 ${
                  isCurrent
                    ? "bg-black text-white border-black shadow-md font-bold"
                    : isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                    : "bg-background border-gray-200 text-gray-500 hover:text-gray-950"
                }`}
              >
                <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-70">
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
          className={`p-4 rounded-sm text-xs flex items-center gap-2.5 shadow-sm ${
            updateMessage.startsWith("Error")
              ? "bg-rose-50 border border-rose-200 text-rose-800"
              : "bg-emerald-50 border border-emerald-200 text-emerald-800"
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
          <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-7 space-y-5 shadow-sm">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-900" /> Customer &amp; Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-800">
              <div className="space-y-2 p-4 sm:p-5 rounded-sm bg-background border border-gray-200">
                <div className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Customer Contact
                </div>
                <div className="text-sm font-bold text-gray-950">{order.customerName}</div>
                <div className="text-gray-800 font-mono text-xs flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-accent" /> {order.customerPhone}
                </div>
                {order.customerEmail && (
                  <div className="text-gray-600 text-xs flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {order.customerEmail}
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4 sm:p-5 rounded-sm bg-background border border-gray-200">
                <div className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Delivery Address
                </div>
                <div className="text-gray-950 font-medium flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{order.shippingAddress}</span>
                </div>
                <div className="text-gray-600 pl-5 font-semibold">
                  {order.city} {order.postalCode ? `(${order.postalCode})` : ""}
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="p-4 rounded-sm bg-background border border-gray-200 space-y-1">
                <div className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  Customer Instructions / Delivery Note:
                </div>
                <p className="text-gray-800 text-xs whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Ordered Items Table */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-7 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Ordered Products ({order.items.length})</span>
              <span className="text-gray-400 font-mono">Invoice Snapshot</span>
            </h2>

            {/* Mobile Items Cards */}
            <div className="sm:hidden space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="p-3.5 rounded-sm bg-background border border-gray-200 space-y-1.5">
                  <div className="font-bold text-xs text-gray-950">{item.productNameSnapshot}</div>
                  {item.variantSnapshot && (
                    <div className="text-accent text-[10px] font-bold">Variant: {item.variantSnapshot}</div>
                  )}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60 font-mono">
                    <span className="text-gray-500">{item.quantity} x {formatPrice(item.unitPrice)}</span>
                    <strong className="text-gray-950 font-bold">{formatPrice(item.totalPrice)}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Items Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider bg-background">
                    <th className="py-3 px-3 rounded-l-xl">Product Name &amp; Spec</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3 text-center">Qty</th>
                    <th className="py-3 px-3">Unit Price</th>
                    <th className="py-3 px-3 text-right rounded-r-xl">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-gray-950">{item.productNameSnapshot}</div>
                        {item.variantSnapshot && (
                          <div className="text-accent text-xs font-bold">
                            Variant: {item.variantSnapshot}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-gray-500 text-xs">
                        {item.skuSnapshot}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-gray-950 font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-3 text-gray-700 font-mono">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-gray-950 font-mono">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Items</span>
                <span className="font-semibold text-gray-950 font-mono">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Courier Delivery Fee</span>
                <span className="font-semibold text-gray-950 font-mono">
                  {order.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE DELIVERY</span>
                  ) : (
                    formatPrice(order.deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-950 pt-3 border-t border-stone-100">
                <span>Total Amount Due</span>
                <span className="text-accent font-black font-mono text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Status Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-7 space-y-5 shadow-sm sticky top-24">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-stone-100 flex items-center gap-2">
              <Save className="w-4 h-4 text-gray-900" /> Update Order Status
            </h2>

            <form onSubmit={(e) => handleUpdate(e)} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  Fulfillment Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full h-11 px-3.5 bg-background border border-gray-200 rounded-sm text-gray-900 font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing (Packing)</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full h-11 px-3.5 bg-background border border-gray-200 rounded-sm text-gray-900 font-bold"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="paid">Paid (Verified)</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  Internal Staff Note / Courier Tracking #
                </label>
                <Textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  className="bg-background border-gray-200 text-gray-900 rounded-sm focus:bg-white text-xs"
                  placeholder="e.g. Dispatched via TCS Tracking # 789123456"
                />
              </div>

              <Button
                type="submit"
                isLoading={isUpdating}
                className="w-full bg-card text-foreground hover:bg-accent hover:text-white text-white font-bold h-12 rounded-full shadow-md transition-all text-xs"
              >
                Save Order Changes
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


