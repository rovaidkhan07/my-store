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
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  RotateCcw,
  X,
  History,
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
  const [notes, setNotes] = useState<string>("Restock batch shipment");
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
    setNotes("New inventory shipment received");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-500" /> Inventory &amp; Stock Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time warehouse stock levels, low stock warnings, and record audit adjustments.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusTab("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusTab === "all"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setStatusTab("low")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusTab === "low"
                ? "bg-amber-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Low Stock Alerts
          </button>
          <button
            onClick={() => setStatusTab("out")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusTab === "out"
                ? "bg-rose-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => setStatusTab("in")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusTab === "in"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Healthy Stock (&gt;5)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border-slate-800 text-white pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading inventory records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products found in this inventory category.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isOutOfStock = product.stockQuantity <= 0;
                  const isLowStock =
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= product.lowStockThreshold;

                  return (
                    <tr key={product.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white line-clamp-1">{product.name}</div>
                        <div className="text-[11px] text-blue-400 font-semibold">{product.brand}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{product.sku}</td>
                      <td className="py-3.5 px-4 text-slate-400">{product.category?.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-white font-mono">
                          {product.stockQuantity}
                        </span>{" "}
                        <span className="text-slate-500">units</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {product.lowStockThreshold} units
                      </td>
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3" /> Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAdjust(product)}
                          className="bg-slate-900 hover:bg-slate-800 text-blue-400 border-slate-700 text-xs font-bold"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl text-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Adjust Stock Level</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{selectedProduct.name}</p>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">
                  {error}
                </div>
              )}

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Current Stock:</span>
                <strong className="text-white font-mono text-sm">
                  {selectedProduct.stockQuantity} units
                </strong>
              </div>

              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                    Apply to Variant (Optional)
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
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
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Quantity Change (+ to add, - to reduce) *
                </label>
                <Input
                  type="number"
                  value={quantityDelta}
                  onChange={(e) => setQuantityDelta(parseInt(e.target.value, 10) || 0)}
                  required
                  className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                  placeholder="+10 or -5"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  New projected stock:{" "}
                  <strong className="text-blue-400">
                    {Math.max(0, selectedProduct.stockQuantity + Number(quantityDelta))} units
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Transaction Reason Type *
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="purchase">Purchase / Supplier Stock Restock</option>
                  <option value="adjustment">Manual Count Adjustment</option>
                  <option value="damaged">Damaged / Expired / Written Off</option>
                  <option value="return">Customer Return Restock</option>
                  <option value="manual_update">Direct Manual Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Audit Notes / Reason *
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  placeholder="e.g. Received carton batch #48 from Anker distributor"
                  rows={2}
                  className="bg-slate-800 border-slate-700 text-white"
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
                <Button type="submit" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
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
