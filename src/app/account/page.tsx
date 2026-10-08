"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { STORE_CONFIG } from "@/lib/config/store";
import { Button } from "@/components/ui/button";
import {
  User,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [meRes, ordersRes] = await Promise.all([
        fetch("/api/auth/customer/me"),
        fetch("/api/auth/customer/orders"),
      ]);

      const meData = await meRes.json();
      const ordersData = await ordersRes.json();

      if (!meData.authenticated) {
        router.push("/login?redirect=/account");
        return;
      }

      setCustomer(meData.user);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error("Failed to load customer account", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/customer/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-background flex items-center justify-center text-xs text-gray-500">
        <div className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary animate-ping" />
          <span>Loading your account &amp; orders...</span>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  const pipelineSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

  return (
    <div className="min-h-[85vh] bg-background text-gray-900 py-10 px-4 sm:px-6 lg:px-8 relative selection:bg-primary selection:text-white">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-amber-300/10 rounded-sm blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Customer Card */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-black text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              {customer.name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-background border border-gray-200 text-[11px] font-bold text-gray-800 shadow-2xs mb-1">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>{customer.role === "admin" ? "Kharidly Super Admin" : "Kharidly Member"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Welcome, {customer.name}
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {customer.email}
                {customer.phone && <span>• {customer.phone}</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {customer.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary hover:bg-[#e04a00] text-white text-xs font-black shadow-md hover:shadow-primary/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal &rarr;
              </Link>
            )}

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground hover:bg-accent text-xs font-bold shadow-md transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-white hover:bg-rose-50 text-gray-700 hover:text-rose-700 text-xs font-bold border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Executive Admin Suite Quick Access Callout */}
        {customer.role === "admin" && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-black text-white rounded-sm p-6 sm:p-7 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-primary text-white flex items-center justify-center font-black shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-accent">Staff Executive Console</span>
                  <span className="text-[10px] bg-white/15 text-slate-200 px-2.5 py-0.5 rounded-sm font-bold">Full Access</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">Kharidly Admin Management Suite</h2>
                <p className="text-xs text-gray-300 mt-0.5">Manage live orders, catalog products, categories, stock inventory levels, and store configurations.</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-primary hover:bg-[#e04a00] text-white text-xs font-black shadow-lg hover:shadow-primary/25 transition-all shrink-0 cursor-pointer"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Customer Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Orders Placed
              </div>
              <div className="text-3xl font-black text-gray-900 font-mono mt-1">
                {orders.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 font-medium">Lifetime order count</div>
            </div>
            <div className="w-11 h-11 rounded-sm bg-background border border-gray-200 flex items-center justify-center text-gray-900 shadow-2xs">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
          </div>

          <div className="bg-white border border-amber-200/90 rounded-sm p-6 shadow-sm flex items-center justify-between bg-gradient-to-b from-amber-50/40 to-transparent">
            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Active in Transit
              </div>
              <div className="text-3xl font-black text-amber-700 font-mono mt-1">
                {pendingOrders}
              </div>
              <div className="text-[11px] text-amber-700/80 mt-0.5 font-medium">Under processing &amp; courier delivery</div>
            </div>
            <div className="w-11 h-11 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Purchase Value
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono mt-1">
                {formatPrice(totalSpent)}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 font-medium">{deliveredOrders} orders successfully delivered</div>
            </div>
            <div className="w-11 h-11 rounded-sm bg-background border border-gray-200 flex items-center justify-center text-gray-900 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 shadow-2xs"
            }`}
          >
            Order History &amp; Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 shadow-2xs"
            }`}
          >
            Profile &amp; Contact Details
          </button>
        </div>

        {/* TAB 1: Orders List */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-sm bg-background border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-gray-900">No orders placed yet</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
                  When you purchase mobile accessories, GaN chargers, or audio products, they will appear here with live tracking.
                </p>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-accent font-bold px-6 rounded-sm text-xs"
                >
                  <Link href="/shop">Start Shopping &rarr;</Link>
                </Button>
              </div>
            ) : (
              orders.map((order) => {
                const currentStepIdx = pipelineSteps.indexOf(order.orderStatus);
                const orderWhatsAppUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Kharidly,\nI need an update on my Order *${order.orderNumber}* (Total: ${formatPrice(order.total)}).\nThank you!`
                )}`;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-sm p-6 sm:p-7 shadow-sm space-y-5"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-900">
                          <span>Order:</span>
                          <span className="text-accent">#{order.orderNumber}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" /> Placed on {formatDate(order.createdAt)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Status Badge */}
                        <span
                          className={`capitalize px-3.5 py-1 rounded-sm text-xs font-bold inline-flex items-center gap-1.5 ${
                            order.orderStatus === "delivered"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : order.orderStatus === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-secondary text-gray-700 border border-gray-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-sm bg-current" />
                          {order.orderStatus}
                        </span>

                        {/* WhatsApp Helpline Button */}
                        <a
                          href={orderWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-sm bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Help with Order
                        </a>
                      </div>
                    </div>

                    {/* Delivery Stepper */}
                    {order.orderStatus !== "cancelled" && (
                      <div className="p-4 bg-background rounded-sm border border-gray-200/80">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                          Delivery Progress
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          {pipelineSteps.map((step, idx) => {
                            const isReached = currentStepIdx >= idx;
                            const isCurrent = order.orderStatus === step;

                            return (
                              <div key={step} className="space-y-1.5">
                                <div
                                  className={`h-1.5 rounded-sm transition-all ${
                                    isReached ? "bg-emerald-500" : "bg-stone-200"
                                  }`}
                                />
                                <div
                                  className={`text-[10px] capitalize font-bold ${
                                    isCurrent
                                      ? "text-gray-900"
                                      : isReached
                                      ? "text-emerald-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ordered Items List */}
                    <div className="space-y-3">
                      {order.items?.map((item: any) => {
                        const img =
                          item.product?.images?.[0]?.imageUrl ||
                          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100";

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-sm bg-white border border-stone-100 hover:border-gray-200 transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="relative w-12 h-12 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0">
                                <Image
                                  src={img}
                                  alt={item.productNameSnapshot}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-900">
                                  {item.productNameSnapshot}
                                </div>
                                <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                                  {item.skuSnapshot}{" "}
                                  {item.variantSnapshot && (
                                    <span className="text-accent font-bold">
                                      • {item.variantSnapshot}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-black text-gray-900 font-mono">
                                {formatPrice(item.totalPrice)}
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium">
                                {item.quantity} x {formatPrice(item.unitPrice)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Footer / Shipping Info */}
                    <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                      <div className="text-gray-600 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>
                          Shipping to: <strong className="text-gray-900">{order.shippingAddress}, {order.city}</strong>
                        </span>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-gray-500">Order Total: </span>
                        <strong className="text-base text-gray-900 font-black">
                          {formatPrice(order.total)}
                        </strong>{" "}
                        <span className="text-[11px] text-gray-400">
                          ({order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: Profile Settings */}
        {activeTab === "profile" && (
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Personal Account Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-sm bg-background border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Full Name
                </span>
                <div className="text-sm font-bold text-gray-900">{customer.name}</div>
              </div>

              <div className="p-4 rounded-sm bg-background border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Registered Email
                </span>
                <div className="text-sm font-bold text-gray-900">{customer.email}</div>
              </div>

              <div className="p-4 rounded-sm bg-background border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Mobile Number
                </span>
                <div className="text-sm font-bold text-gray-900">
                  {customer.phone || "Not provided (auto-saved upon your next checkout)"}
                </div>
              </div>

              <div className="p-4 rounded-sm bg-background border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  Account Member Since
                </span>
                <div className="text-xs font-semibold text-gray-700">
                  {formatDate(customer.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


