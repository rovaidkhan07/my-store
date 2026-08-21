"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderWithDetails } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (statusFilter !== "all") params.set("status", statusFilter);
      if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      setOrders(data.orders || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter, paymentFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-500" /> Customer Orders ({totalCount})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, process, update fulfillment status and manage customer receipts.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by order #, customer name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border-slate-800 text-white pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-44 h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
        >
          <option value="all">All Payment Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-slate-400 text-[11px]">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{order.city}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                        {order.paymentMethod === "cod" ? "COD" : "Bank"} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`capitalize px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : order.orderStatus === "pending"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-950 text-blue-400 border border-blue-800"
                            : order.orderStatus === "cancelled"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="bg-slate-900 border-slate-800 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="bg-slate-900 border-slate-800 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
