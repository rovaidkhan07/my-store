"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RotateCcw,
  X,
  History,
  ShieldCheck,
  TrendingUp,
  Package,
} from "lucide-react";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | "low" | "out" | "in">("all");

  // Adjust Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantityDelta, setQuantityDelta] = useState<number>(10);
  const [transactionType, setTransactionType] = useState<string>("purchase");
  const [notes, setNotes] = useState<string>("Supplier shipment restock batch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "100",
        status: statusTab,
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/inventory?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, statusTab]);

  const handleOpenAdjust = (product: any) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants?.[0]?.id || "");
    setQuantityDelta(10);
    setTransactionType("purchase");
    setNotes("New inventory batch received");
    setError(null);
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          variantId: selectedVariantId || null,
          quantityChange: Number(quantityDelta),
          transactionType,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to adjust stock");
      }

      setAdjustModalOpen(false);
      fetchInventory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Adjustment failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalStockUnits = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const lowCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;
  const outCount = products.filter((p) => p.stockQuantity <= 0).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            <span>Warehouse Stock Audit &amp; Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Inventory &amp; Stock Levels
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time warehouse inventory, restock incoming shipments, and record stock adjustment audits.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Stocked Units
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalStockUnits.toLocaleString()} units
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all active items</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0B0E14] border border-amber-500/30 rounded-3xl p-5 shadow-lg flex items-center justify-between bg-gradient-to-b from-amber-500/10 to-transparent">
          <div>
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Low Stock Warnings
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {lowCount} products
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">Below reorder threshold</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0B0E14] border border-rose-500/30 rounded-3xl p-5 shadow-lg flex items-center justify-between bg-gradient-to-b from-rose-500/10 to-transparent">
          <div>
            <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
              Out of Stock (Critical)
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              {outCount} products
            </div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">Needs immediate supplier order</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B0E14] border border-slate-800/90 p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusTab("all")}
            className={`px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer ${
              statusTab === "all"
                ? "bg-gradient-to-r from-amber-500 to-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setStatusTab("low")}
            className={`px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer ${
              statusTab === "low"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Low Stock Alerts
          </button>
          <button
            onClick={() => setStatusTab("out")}
            className={`px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer ${
              statusTab === "out"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => setStatusTab("in")}
            className={`px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer ${
              statusTab === "in"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Healthy Stock (&gt;5)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search by product title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 pl-9 text-xs rounded-xl h-10"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                <th className="py-4 px-4">Product Details</th>
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Warehouse Stock</th>
                <th className="py-4 px-4">Threshold</th>
                <th className="py-4 px-4">Stock Health</th>
                <th className="py-4 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                      <span>Loading warehouse stock records...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    No products found in this inventory view.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isOutOfStock = product.stockQuantity <= 0;
                  const isLowStock =
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= product.lowStockThreshold;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-white line-clamp-1">{product.name}</div>
                        <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                          {product.brand}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-300">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                          {product.sku}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {product.category?.name || "General"}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-black text-sm text-white font-mono">
                          {product.stockQuantity}
                        </span>{" "}
                        <span className="text-slate-500">units</span>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-400">
                        {product.lowStockThreshold} units
                      </td>

                      <td className="py-4 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-3 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenAdjust(product)}
                          className="bg-slate-900 hover:bg-[#FF5500] text-slate-200 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E14] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl text-slate-100 p-6 space-y-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Adjust Stock Level</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{selectedProduct.name}</p>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">
                  {error}
                </div>
              )}

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Current Warehouse Stock:</span>
                <strong className="text-white font-mono text-base">
                  {selectedProduct.stockQuantity} units
                </strong>
              </div>

              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                    Target Variant
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">Base Product Stock</option>
                    {selectedProduct.variants.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.stockQuantity} in stock)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Quantity Adjustment (+/-) *
                </label>
                <Input
                  type="number"
                  value={quantityDelta}
                  onChange={(e) => setQuantityDelta(parseInt(e.target.value, 10) || 0)}
                  required
                  className="bg-slate-900 border-slate-800 text-white font-mono text-base font-bold rounded-xl h-11"
                  placeholder="+10 or -5"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuantityDelta(5)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantityDelta(10)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantityDelta(25)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold"
                  >
                    +25
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantityDelta(50)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantityDelta(-1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-[11px] font-bold"
                  >
                    -1
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 mt-2 block">
                  New projected stock:{" "}
                  <strong className="text-amber-400 font-mono text-xs">
                    {Math.max(0, selectedProduct.stockQuantity + Number(quantityDelta))} units
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Audit Transaction Reason *
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  <option value="purchase">Purchase / Supplier Stock Restock</option>
                  <option value="adjustment">Manual Physical Count Adjustment</option>
                  <option value="damaged">Damaged / Expired / Written Off</option>
                  <option value="return">Customer Return Restock</option>
                  <option value="manual_update">Direct Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Audit Notes / Supplier Reference *
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  placeholder="e.g. Received carton batch #84 from Anker distributor"
                  rows={2}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAdjustModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold px-6 rounded-xl"
                >
                  Save Stock Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
