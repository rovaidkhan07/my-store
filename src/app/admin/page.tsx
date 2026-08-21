import React from "react";
import Link from "next/link";
import { getDashboardMetrics, getRevenueTrends, getOrdersByStatus, getTopSellingProducts } from "@/lib/services/analyticsService";
import { listOrders } from "@/lib/services/orderService";
import { formatPrice, formatDate } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowRight,
  Boxes,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [metrics, trends, statusBreakdown, topProducts, recentOrdersData] = await Promise.all([
    getDashboardMetrics(),
    getRevenueTrends(7),
    getOrdersByStatus(),
    getTopSellingProducts(5),
    listOrders({ limit: 5 }),
  ]);

  const kpis = [
    {
      title: "Total Revenue",
      value: formatPrice(metrics.totalRevenue),
      subtitle: `${formatPrice(metrics.todayRevenue)} today`,
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      subtitle: `${metrics.pendingOrders} pending fulfillment`,
      icon: ShoppingBag,
      color: "text-blue-400 bg-blue-950/60 border-blue-800/60",
    },
    {
      title: "Pending Orders",
      value: metrics.pendingOrders.toString(),
      subtitle: "Requires action",
      icon: Clock,
      color: "text-amber-400 bg-amber-950/60 border-amber-800/60",
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockCount.toString(),
      subtitle: `${metrics.outOfStockCount} items out of stock`,
      icon: AlertTriangle,
      color: "text-rose-400 bg-rose-950/60 border-rose-800/60",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time business performance and operations for MobileHub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> View Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">{kpi.value}</div>
                <div className="text-xs text-slate-400 mt-1">{kpi.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue 7-Day Trend Card */}
        <div className="lg:col-span-8 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue &amp; Orders (Last 7 Days)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily gross sales recorded from orders</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 items-end h-48 border-b border-slate-800 pb-4">
            {trends.map((item, idx) => {
              const maxRev = Math.max(...trends.map((t) => t.revenue), 1000);
              const heightPercent = Math.max(12, Math.round((item.revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    {formatPrice(item.revenue)}
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-800 group-hover:bg-blue-600 rounded-t-lg transition-all" style={{ height: `${heightPercent}%` }} />
                  <div className="text-[10px] font-medium text-slate-400">{item.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status Card */}
        <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" /> Orders Breakdown
          </h2>
          <p className="text-xs text-slate-400">Order count by lifecycle status</p>

          <div className="space-y-3 pt-2">
            {statusBreakdown.map((status) => (
              <div key={status.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-slate-300 font-medium">{status.name}</span>
                </div>
                <span className="font-bold text-white font-mono">{status.value} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest orders placed by customers</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrdersData.orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-400">
                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-slate-400 text-[11px]">{order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{order.city}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{formatPrice(order.total)}</td>
                  <td className="py-3.5 px-3">
                    <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                      {order.paymentMethod === "cod" ? "COD" : "Bank"} • {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`capitalize px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : order.orderStatus === "pending"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : order.orderStatus === "shipped"
                          ? "bg-blue-950 text-blue-400 border border-blue-800"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 px-3 py-1 rounded-lg transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
