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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-bold text-slate-800 shadow-2xs mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Order Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            Customer Orders ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
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
            className={`px-5 py-2.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === s.key
                ? "bg-black text-white shadow-md"
                : "bg-white text-slate-600 hover:text-slate-950 border border-stone-200 shadow-2xs"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-stone-200/90 p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by order # (e.g. MH-2026-...), customer name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#FAF8F5] border-stone-200 text-slate-900 placeholder:text-slate-400 pl-9 text-xs rounded-2xl h-11 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-60 h-11 px-3.5 bg-[#FAF8F5] border border-stone-200 rounded-2xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-1 focus:ring-black"
        >
          <option value="all">All Payment Statuses</option>
          <option value="pending">Pending Payment</option>
          <option value="paid">Paid (Verified)</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-slate-500 font-bold uppercase tracking-wider bg-[#FAF8F5]">
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
            <tbody className="divide-y divide-stone-100">
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
                      className="hover:bg-stone-50/80 transition-colors group"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-950">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-[#FF5500] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-medium">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-950">{order.customerName}</div>
                        <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 text-slate-700 font-semibold">{order.city}</td>

                      {/* Items */}
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-stone-200 font-mono text-[11px]">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-black text-slate-950 font-mono text-xs">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span className="capitalize px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF8F5] border border-stone-200 text-slate-700 inline-flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentStatus === "paid" ? "bg-emerald-600" : "bg-amber-500"
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
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : order.orderStatus === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : order.orderStatus === "cancelled"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-stone-100 text-slate-700 border border-stone-200"
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
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-white bg-[#FAF8F5] hover:bg-black border border-stone-200 hover:border-black px-4 py-1.5 rounded-full transition-all shadow-2xs"
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
          <div className="p-4 border-t border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
            <span className="text-xs text-slate-500 font-medium">
              Showing page <strong className="text-slate-900">{currentPage}</strong> of{" "}
              <strong className="text-slate-900">{totalPages}</strong> ({totalCount} orders total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="bg-white border-stone-200 text-slate-900 rounded-full"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="bg-white border-stone-200 text-slate-900 rounded-full"
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
