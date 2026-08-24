"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderWithDetails } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

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

  const statuses = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Order Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Customer Orders ({totalCount})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Process incoming orders, verify bank transfer receipts, update tracking numbers, and dispatch courier packages.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === s.key
                ? "bg-gradient-to-r from-amber-500 to-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                : "bg-[#0B0E14] text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0B0E14] border border-slate-800/90 p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-3 shadow-lg">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by order # (e.g. MH-2026-...), customer name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 pl-9 text-xs rounded-xl h-10"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-56 h-10 px-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200"
        >
          <option value="all">All Payment Statuses</option>
          <option value="pending">Pending Payment</option>
          <option value="paid">Paid (Verified)</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                <th className="py-4 px-4">Order #</th>
                <th className="py-4 px-4">Date Placed</th>
                <th className="py-4 px-4">Customer Info</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Items Count</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Fulfillment</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const totalItems = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 text-slate-300 font-medium">{order.city}</td>

                      {/* Items */}
                      <td className="py-4 px-4 text-slate-300 font-semibold">
                        <span className="bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800 font-mono text-[11px]">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-black text-white font-mono text-xs">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span className="capitalize px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 inline-flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentStatus === "paid" ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          {order.paymentMethod === "cod" ? "COD" : "Bank"} • {order.paymentStatus}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`capitalize px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                            order.orderStatus === "delivered"
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                              : order.orderStatus === "pending"
                              ? "bg-amber-950/80 text-amber-300 border border-amber-800/80"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-950/80 text-blue-300 border border-blue-800/80"
                              : order.orderStatus === "cancelled"
                              ? "bg-rose-950/80 text-rose-300 border border-rose-800/80"
                              : "bg-slate-900 text-slate-300 border border-slate-800"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-white bg-amber-500/10 hover:bg-[#FF5500] border border-amber-500/20 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
            <span className="text-xs text-slate-400">
              Showing page <strong className="text-white">{currentPage}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong> ({totalCount} orders total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
