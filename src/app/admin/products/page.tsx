"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Filter,
  Check,
  Zap,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "featured" | "low" | "out">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(
          `/api/products?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}${
            selectedCategory ? `&category=${selectedCategory}` : ""
          }`
        ),
        fetch("/api/categories?all=true"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory]);

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleToggleActive = async (product: ProductWithDetails) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch (err) {
      console.error("Toggle active failed", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate or remove "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Client-side filtering for sub-tabs
  const filteredProducts = products.filter((p) => {
    if (statusFilter === "active") return p.isActive;
    if (statusFilter === "featured") return p.isFeatured;
    if (statusFilter === "low") return p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
    if (statusFilter === "out") return p.stockQuantity <= 0;
    return true;
  });

  const totalCatalog = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity <= 0).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Products &amp; Pricing ({totalCatalog})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product specs, pricing, discounted sale values, inventory thresholds, and active status.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-[#FF5500]/25 gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#FF5500]/15 border-[#FF5500]/40 text-white shadow-sm"
              : "bg-[#0B0E14] border-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider">Total Catalog</div>
          <div className="text-xl font-black text-white mt-0.5">{totalCatalog}</div>
        </button>

        <button
          onClick={() => setStatusFilter("active")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "active"
              ? "bg-emerald-500/15 border-emerald-500/40 text-white shadow-sm"
              : "bg-[#0B0E14] border-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active Live</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{activeCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("low")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "low"
              ? "bg-amber-500/15 border-amber-500/40 text-white shadow-sm"
              : "bg-[#0B0E14] border-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Low Stock</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">{lowStockCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("out")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "out"
              ? "bg-rose-500/15 border-rose-500/40 text-white shadow-sm"
              : "bg-[#0B0E14] border-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Out of Stock</div>
          <div className="text-xl font-black text-rose-400 mt-0.5">{outOfStockCount}</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B0E14] border border-slate-800/90 p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-3 shadow-lg">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by title, SKU, or brand name (e.g. Anker, Baseus)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 pl-9 text-xs rounded-xl h-10"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-60 h-10 px-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-[#FF5500]"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                <th className="py-4 px-4">Product Details</th>
                <th className="py-4 px-4">SKU / Brand</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price &amp; Sale</th>
                <th className="py-4 px-4">Warehouse Stock</th>
                <th className="py-4 px-4">Active</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                      <span>Loading products catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const img =
                    product.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100";
                  const isOutOfStock = product.stockQuantity <= 0;
                  const isLowStock =
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= product.lowStockThreshold;

                  const discountPercent =
                    product.salePrice && product.price > product.salePrice
                      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                      : null;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 group-hover:border-amber-500/50 transition-colors">
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white line-clamp-1 flex items-center gap-1.5">
                              <span>{product.name}</span>
                              {product.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                  <Sparkles className="w-2.5 h-2.5 fill-amber-300" /> Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>{product.brand}</span>
                              {product.variants && product.variants.length > 0 && (
                                <span className="text-amber-400 font-medium">
                                  • {product.variants.length} variants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Brand */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-slate-300 font-semibold bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800 text-[11px]">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="text-slate-300 font-medium">
                          {product.category?.name || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="font-black text-white font-mono text-xs">
                          {formatPrice(product.salePrice || product.price)}
                        </div>
                        {product.salePrice && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 line-through font-mono">
                              {formatPrice(product.price)}
                            </span>
                            {discountPercent && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Warehouse Stock */}
                      <td className="py-4 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> 0 Units (Out of Stock)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> {product.stockQuantity} Left (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {product.stockQuantity} In Stock
                          </span>
                        )}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                            product.isActive
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800"
                              : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-emerald-950 hover:text-emerald-300"
                          }`}
                          title="Click to toggle active status"
                        >
                          {product.isActive ? "Active" : "Draft / Off"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                            title="View on Live Store"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
