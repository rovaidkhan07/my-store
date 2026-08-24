import React from "react";
import Link from "next/link";
import {
  getDashboardMetrics,
  getRevenueTrends,
  getOrdersByStatus,
  getTopSellingProducts,
} from "@/lib/services/analyticsService";
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
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowUpRight,
  Layers,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [metrics, trends, statusBreakdown, topProducts, recentOrdersData] =
    await Promise.all([
      getDashboardMetrics(),
      getRevenueTrends(7),
      getOrdersByStatus(),
      getTopSellingProducts(5),
      listOrders({ limit: 6 }),
    ]);

  const kpis = [
    {
      title: "Total Gross Revenue",
      value: formatPrice(metrics.totalRevenue),
      subtitle: `${formatPrice(metrics.todayRevenue)} today • ${formatPrice(metrics.monthRevenue)} this month`,
      icon: DollarSign,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400 bg-emerald-950/80 border-emerald-800/80",
      accent: "text-emerald-400",
    },
    {
      title: "Total Store Orders",
      value: metrics.totalOrders.toString(),
      subtitle: `${metrics.pendingOrders} pending • ${metrics.deliveredOrders} delivered`,
      icon: ShoppingBag,
      gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400 bg-amber-950/80 border-amber-800/80",
      accent: "text-amber-400",
    },
    {
      title: "Pending Fulfillment",
      value: metrics.pendingOrders.toString(),
      subtitle:
        metrics.pendingOrders > 0
          ? "Requires packaging & dispatch"
          : "All orders fulfilled",
      icon: Clock,
      gradient: "from-[#FF5500]/20 via-[#FF5500]/10 to-transparent",
      borderColor: "border-[#FF5500]/30",
      iconColor: "text-[#FF5500] bg-orange-950/80 border-orange-800/80",
      accent: "text-[#FF5500]",
    },
    {
      title: "Inventory Health",
      value: `${metrics.lowStockCount + metrics.outOfStockCount} Alerts`,
      subtitle: `${metrics.lowStockCount} low stock • ${metrics.outOfStockCount} out of stock`,
      icon: AlertTriangle,
      gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
      borderColor: "border-rose-500/30",
      iconColor: "text-rose-400 bg-rose-950/80 border-rose-800/80",
      accent: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E121B] via-slate-900 to-[#14101A] border border-slate-800/90 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MobileHub Executive Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Store Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Real-time analytics, automated order fulfillment pipeline, inventory stock warnings, and revenue metrics.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 transition-all"
            >
              <Boxes className="w-4 h-4 text-blue-400" /> Stock Audit
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" /> Orders ({metrics.totalOrders})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden bg-[#0B0E14] bg-gradient-to-b ${kpi.gradient} border ${kpi.borderColor} rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm ${kpi.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-5 space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {kpi.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Revenue Trend */}
        <div className="lg:col-span-8 bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-lg space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Gross Revenue Trends (Last 7 Days)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily sales performance tracked in PKR
              </p>
            </div>
            <div className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              Live Trend
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="grid grid-cols-7 gap-3 pt-6 items-end h-52 border-b border-slate-800/80 pb-4">
            {trends.map((item, idx) => {
              const maxRev = Math.max(...trends.map((t) => t.revenue), 1000);
              const heightPercent = Math.max(14, Math.round((item.revenue / maxRev) * 100));

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2.5 h-full justify-end group cursor-pointer"
                >
                  <div className="text-[10px] text-amber-300 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 shadow-md">
                    {formatPrice(item.revenue)}
                  </div>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-slate-800 to-slate-700 group-hover:from-amber-600 group-hover:to-[#FF5500] rounded-t-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#FF5500]/25"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" /> High-traffic days
            </span>
            <span className="font-mono text-white font-bold">
              Peak: {formatPrice(Math.max(...trends.map((t) => t.revenue), 0))}
            </span>
          </div>
        </div>

        {/* Orders Status Distribution */}
        <div className="lg:col-span-4 bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-lg space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Orders Lifecycle
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                {metrics.totalOrders} total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Breakdown by active customer fulfillment status
            </p>

            <div className="space-y-3.5 pt-4">
              {statusBreakdown.map((status) => {
                const total = Math.max(1, metrics.totalOrders);
                const percent = Math.round((status.value / total) * 100);

                return (
                  <div key={status.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-slate-300 font-medium">{status.name}</span>
                      </div>
                      <span className="font-bold text-white font-mono">
                        {status.value} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: status.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold text-center border border-slate-800 transition-colors block"
          >
            Manage All Orders &rarr;
          </Link>
        </div>
      </div>

      {/* Top Best Sellers Leaderboard & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Sellers */}
        <div className="lg:col-span-6 bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Best Selling Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              Full Catalog &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No sales recorded yet. Place test orders to populate the leaderboard.
              </div>
            ) : (
              topProducts.map((p, idx) => {
                const medalColors = [
                  "bg-amber-400 text-slate-950 font-black",
                  "bg-slate-300 text-slate-950 font-bold",
                  "bg-amber-700 text-white font-bold",
                ];

                return (
                  <div
                    key={p.productId}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                          medalColors[idx] || "bg-slate-800 text-slate-400 font-bold"
                        }`}
                      >
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.unitsSold} units sold
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400 font-mono">
                        {formatPrice(p.totalRevenue)}
                      </div>
                      <div className="text-[10px] text-slate-500">Gross Sales</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Management Suite */}
        <div className="lg:col-span-6 bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF5500]" /> Operations Center
            </h2>
            <span className="text-xs text-slate-400 font-mono">Fast Actions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href="/admin/products"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-[#FF5500]/40 hover:bg-slate-900 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Product Catalog</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Edit prices, upload images, add GaN chargers and cables.
              </div>
            </Link>

            <Link
              href="/admin/inventory"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Inventory Controls</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Log supplier shipments, restock batches, and adjust stock counts.
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Categories Setup</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Organize storefront departments and navigation menus.
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Store &amp; Bank Settings</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Update WhatsApp support number, bank account, and delivery fees.
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Recent Orders Table */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FF5500]" /> Recent Customer Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live queue of latest customer checkouts and payment statuses
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="py-3.5 px-4 rounded-l-xl">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrdersData.orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{order.city}</td>
                  <td className="py-3.5 px-4 font-black text-white font-mono">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 inline-flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.paymentStatus === "paid" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      {order.paymentMethod === "cod" ? "COD" : "Bank"} • {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                          : order.orderStatus === "pending"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/80"
                          : order.orderStatus === "shipped"
                          ? "bg-blue-950/80 text-blue-300 border border-blue-800/80"
                          : "bg-slate-900 text-slate-300 border border-slate-800"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-white bg-amber-500/10 hover:bg-[#FF5500] border border-amber-500/20 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
