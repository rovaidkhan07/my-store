import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/services/orderService";
import { formatPrice, formatDate } from "@/lib/utils";
import { STORE_CONFIG, buildWhatsAppOrderSupportUrl } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Truck,
  Building2,
  MessageCircle,
  ArrowRight,
  Printer,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderConfirmationProps {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function OrderConfirmationPage({ params, searchParams }: OrderConfirmationProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;
  const order = await getOrderByNumber(orderNumber);

  // A confirmation URL is a bearer credential. Only the original checkout redirect,
  // which carries the fresh tracking token, may render its customer information.
  if (!token || !order || !order.trackingToken) {
    notFound();
  }

  const tokenHash = (await import("crypto")).default.createHash("sha256").update(token).digest("hex");
  if (tokenHash !== order.trackingToken) {
    notFound();
  }

  if (!order) {
    notFound();
  }

  const whatsAppUrl = buildWhatsAppOrderSupportUrl(order.orderNumber);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Thank you for your order, {order.customerName}!
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Your order has been recorded. We will pack and dispatch your parcel promptly.
            </p>
          </div>

          {/* Order Reference Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-mono font-bold text-slate-900 border border-slate-200">
            <span>Order Number:</span>
            <span className="text-orange-600">{order.orderNumber}</span>
          </div>
        </div>

        {/* Bank Transfer Alert (if applicable) */}
        {order.paymentMethod === "bank_transfer" && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-orange-900 font-bold text-sm">
              <Building2 className="w-5 h-5 text-orange-600" />
              Bank Transfer Instructions
            </div>
            <p className="text-slate-700 leading-relaxed">
              Please transfer the total amount of <strong>{formatPrice(order.total)}</strong> to the following bank account and send the transfer slip screenshot to our WhatsApp with your order number:
            </p>
            <div className="bg-white p-4 rounded-xl border border-orange-100 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Name:</span>
                <strong className="text-slate-900">{STORE_CONFIG.bankDetails.bankName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Title:</span>
                <strong className="text-slate-900">{STORE_CONFIG.bankDetails.accountTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Number:</span>
                <strong className="text-slate-900 font-mono">{STORE_CONFIG.bankDetails.accountNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IBAN:</span>
                <strong className="text-slate-900 font-mono">{STORE_CONFIG.bankDetails.iban}</strong>
              </div>
            </div>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Send Slip via WhatsApp
            </a>
          </div>
        )}

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" /> Order Details
          </h2>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-2">Delivery Address</div>
              <p className="font-medium text-slate-800">{order.customerName}</p>
              <p className="mt-1">{order.shippingAddress}</p>
              <p>{order.city} {order.postalCode ? `, ${order.postalCode}` : ""}</p>
              <p className="mt-1 text-slate-500">Phone: {order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-500">Email: {order.customerEmail}</p>}
            </div>

            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-2">Payment &amp; Status</div>
              <div className="space-y-1">
                <div>
                  Payment Method:{" "}
                  <strong className="text-slate-900 capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                  </strong>
                </div>
                <div>
                  Payment Status:{" "}
                  <span className="capitalize font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {order.paymentStatus}
                  </span>
                </div>
                <div>
                  Order Status:{" "}
                  <span className="capitalize font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {order.orderStatus}
                  </span>
                </div>
                <div className="text-slate-400 pt-1">
                  Placed On: {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ordered Items</div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900">{item.productNameSnapshot}</div>
                    {item.variantSnapshot && (
                      <div className="text-slate-500">{item.variantSnapshot}</div>
                    )}
                    <div className="text-slate-400 font-mono">{item.skuSnapshot} • Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm shrink-0">
                    {formatPrice(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-medium text-slate-900">
                {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount</span>
              <span className="text-xl text-orange-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-accent font-bold px-8">
            <Link href="/shop" className="flex items-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-slate-700 hover:bg-white"
          >
            <Link href={`/track-order?token=${order.trackingToken}`}>
              Track Order Status
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
