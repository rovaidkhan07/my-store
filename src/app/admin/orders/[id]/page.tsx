"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderWithDetails } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { buildWhatsAppOrderSupportUrl } from "@/lib/config/store";
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
  CheckCircle,
  AlertCircle,
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          notes: statusNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update order");
      }

      setUpdateMessage("Order updated successfully!");
      setStatusNote("");
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
      <div className="py-20 text-center text-slate-500 text-sm">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const cleanPhone = order.customerPhone.replace(/\D/g, "");
  const customerWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customerName}, this is regarding your order ${order.orderNumber} at MobileHub.`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              Order: <span className="font-mono text-blue-400">{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={customerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Message Customer on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {updateMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            updateMessage.startsWith("Error")
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
          }`}
        >
          {updateMessage.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{updateMessage}</span>
        </div>
      )}

      {/* Grid: Details & Status Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Order Items & Customer Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Delivery Box */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer &amp; Shipping Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <div className="text-slate-500 font-semibold mb-1">Customer</div>
                <div className="text-sm font-bold text-white">{order.customerName}</div>
                <div className="text-slate-400 mt-0.5 font-mono">{order.customerPhone}</div>
                {order.customerEmail && <div className="text-slate-400">{order.customerEmail}</div>}
              </div>

              <div>
                <div className="text-slate-500 font-semibold mb-1">Shipping Address</div>
                <div className="text-white font-medium">{order.shippingAddress}</div>
                <div className="text-slate-400">
                  {order.city} {order.postalCode ? `, ${order.postalCode}` : ""}
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="pt-3 border-t border-slate-800 text-xs">
                <div className="text-slate-500 font-semibold mb-1">Customer Notes:</div>
                <div className="text-slate-300 bg-slate-900 p-3 rounded-xl whitespace-pre-wrap">
                  {order.notes}
                </div>
              </div>
            )}
          </div>

          {/* Ordered Items Table */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5">Item</th>
                    <th className="py-2.5">SKU</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5">Unit Price</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <div className="font-semibold text-white">{item.productNameSnapshot}</div>
                        {item.variantSnapshot && (
                          <div className="text-slate-400 text-[11px]">{item.variantSnapshot}</div>
                        )}
                      </td>
                      <td className="py-3 font-mono text-slate-400">{item.skuSnapshot}</td>
                      <td className="py-3 text-center font-bold text-white">{item.quantity}</td>
                      <td className="py-3 text-slate-300">{formatPrice(item.unitPrice)}</td>
                      <td className="py-3 text-right font-bold text-white">{formatPrice(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-white">
                  {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Amount Due</span>
                <span className="text-blue-400 font-black">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Status Management Form */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleUpdate}
            className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-5 text-xs"
          >
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Update Order Status
            </h2>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Fulfillment Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
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
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option value="pending">Pending (Unpaid)</option>
                <option value="paid">Paid (Verified)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Status Note / Tracking Info
              </label>
              <Textarea
                placeholder="Add internal note or courier tracking number (e.g. TCS / Leopards #12345)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                className="bg-slate-900 border-slate-800 text-white text-xs"
              />
            </div>

            <Button
              type="submit"
              isLoading={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold gap-2 text-xs h-10"
            >
              <Save className="w-4 h-4" /> Save Status Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
