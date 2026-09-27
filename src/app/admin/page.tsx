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
      title: "Gross Revenue",
      value: formatPrice(metrics.totalRevenue),
      subtitle: `${formatPrice(metrics.todayRevenue)} today`,
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Store Orders",
      value: metrics.totalOrders.toString(),
      subtitle: `${metrics.pendingOrders} pending • ${metrics.deliveredOrders} done`,
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Pending Orders",
      value: metrics.pendingOrders.toString(),
      subtitle: metrics.pendingOrders > 0 ? "Requires packaging" : "All orders fulfilled",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Stock Health",
      value: `${metrics.lowStockCount + metrics.outOfStockCount} Alerts`,
      subtitle: `${metrics.lowStockCount} low • ${metrics.outOfStockCount} out`,
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-stone-200 text-[11px] font-bold text-slate-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
              <span>MobileHub Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
              Store Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
              Real-time analytics, automated fulfillment queue, and inventory alerts.
            </p>
          </div>

          {/* Quick Action Shortcuts (Mobile Horizontal Scroll / Wrap) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-black hover:bg-[#FF5500] text-white text-xs font-bold shadow-md hover:shadow-[#FF5500]/25 transition-all duration-300"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#FAF8F5] hover:bg-stone-100 text-slate-900 text-xs font-bold border border-stone-200 shadow-2xs transition-colors"
            >
              <Boxes className="w-4 h-4 text-slate-700" /> Stock Audit
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#FAF8F5] hover:bg-stone-100 text-slate-900 text-xs font-bold border border-stone-200 shadow-2xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF5500]" /> Orders ({metrics.totalOrders})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (2-columns on mobile, 4-columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">
                  {kpi.title}
                </span>
                <div
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-2xs shrink-0 ${kpi.iconBg}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="mt-3 sm:mt-5 space-y-0.5 sm:space-y-1">
                <div className="text-lg sm:text-3xl font-black text-slate-950 tracking-tight font-mono truncate">
                  {kpi.value}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                  {kpi.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* 7-Day Revenue Trend */}
        <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF5500]" />
                <span>Revenue Trends (Last 7 Days)</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Daily sales performance tracked in PKR
              </p>
            </div>
            <div className="text-[10px] sm:text-xs font-bold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Live
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-4 sm:pt-6 items-end h-44 sm:h-52 border-b border-stone-100 pb-4">
            {trends.map((item, idx) => {
              const maxRev = Math.max(...trends.map((t) => t.revenue), 1000);
              const heightPercent = Math.max(14, Math.round((item.revenue / maxRev) * 100));

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1.5 sm:gap-2.5 h-full justify-end group cursor-pointer"
                >
                  <div className="text-[9px] sm:text-[10px] text-slate-900 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded-md border border-stone-200 shadow-sm truncate max-w-full">
                    {formatPrice(item.revenue)}
                  </div>
                  <div
                    className="w-full max-w-[32px] sm:max-w-[42px] bg-slate-900 group-hover:bg-[#FF5500] rounded-t-xl transition-all duration-300 group-hover:shadow-md"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-[9px] sm:text-[11px] font-bold text-slate-500 group-hover:text-slate-950 transition-colors truncate">
                    {item.date.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" /> Active
            </span>
            <span className="font-mono text-slate-950 font-bold">
              Peak: {formatPrice(Math.max(...trends.map((t) => t.revenue), 0))}
            </span>
          </div>
        </div>

        {/* Orders Status Distribution */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-800" /> Orders Lifecycle
              </h2>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {metrics.totalOrders} total
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {statusBreakdown.map((status) => {
                const total = Math.max(1, metrics.totalOrders);
                const percent = Math.round((status.value / total) * 100);

                return (
                  <div key={status.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-slate-700 font-bold">{status.name}</span>
                      </div>
                      <span className="font-bold text-slate-950 font-mono">
                        {status.value} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
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
            className="w-full py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-black hover:text-white text-slate-800 text-xs font-bold text-center border border-stone-200 transition-all block shadow-2xs"
          >
            Manage All Orders &rarr;
          </Link>
        </div>
      </div>

      {/* Top Best Sellers Leaderboard & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Top Sellers */}
        <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5500]" /> Best Selling Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#FF5500] hover:underline"
            >
              Full Catalog &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {topProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No sales recorded yet. Place test orders to populate the leaderboard.
              </div>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-black text-white text-[11px] font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-950 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {p.unitsSold} units sold
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-slate-950 font-mono">
                      {formatPrice(p.totalRevenue)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations Suite */}
        <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF5500]" /> Operations Center
            </h2>
            <span className="text-xs text-slate-500 font-mono">Quick Links</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              href="/admin/products"
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-black hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-900 mb-2">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-950">Catalog</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Manage specs &amp; pricing</div>
            </Link>

            <Link
              href="/admin/inventory"
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-black hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-900 mb-2">
                <Boxes className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-950">Inventory</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stock audits &amp; restock</div>
            </Link>

            <Link
              href="/admin/categories"
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-black hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-900 mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-950">Categories</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Organize store catalog</div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-black hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-900 mb-2">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-950">Settings</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Bank &amp; store profile</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Recent Orders (Mobile Cards + Desktop Table) */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FF5500]" /> Recent Customer Orders
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Live queue of latest customer checkouts
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-slate-900 hover:text-[#FF5500] flex items-center gap-1.5 transition-colors"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 1. Mobile Cards View (Visible on screens < sm) */}
        <div className="sm:hidden space-y-3">
          {recentOrdersData.orders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-950">
                  {order.orderNumber}
                </span>
                <span
                  className={`capitalize px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    order.orderStatus === "delivered"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.orderStatus === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{order.customerName}</div>
                  <div className="text-[11px] text-slate-500">{order.city} • {order.paymentMethod.toUpperCase()}</div>
                </div>
                <div className="font-black text-sm text-slate-950 font-mono">
                  {formatPrice(order.total)}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDate(order.createdAt)}
                </span>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-[#FF5500] transition-colors"
                >
                  Manage Order &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Desktop Table View (Visible on sm and above) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-slate-500 font-bold uppercase tracking-wider bg-[#FAF8F5]">
                <th className="py-3.5 px-4 rounded-l-2xl">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-2xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrdersData.orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-950">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-[#FF5500] transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-950">{order.customerName}</div>
                    <div className="text-slate-500 text-[11px] font-mono">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{order.city}</td>
                  <td className="py-3.5 px-4 font-black text-slate-950 font-mono">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF8F5] border border-stone-200 text-slate-700 inline-flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.paymentStatus === "paid" ? "bg-emerald-600" : "bg-amber-500"
                        }`}
                      />
                      {order.paymentMethod === "cod" ? "COD" : "Bank"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : order.orderStatus === "pending"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : order.orderStatus === "shipped"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-stone-100 text-slate-700 border border-stone-200"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-white bg-[#FAF8F5] hover:bg-black border border-stone-200 hover:border-black px-3.5 py-1.5 rounded-full transition-all shadow-2xs"
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
