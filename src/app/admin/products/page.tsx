"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate or delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" /> Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update pricing, manage stock, and toggle active status.
          </p>
        </div>

        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by title, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border-slate-800 text-white pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Sale</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const img = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100";
                  const isOutOfStock = product.stockQuantity <= 0;
                  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

                  return (
                    <tr key={product.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                            <Image src={img} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white line-clamp-1 flex items-center gap-1.5">
                              {product.name}
                              {product.isFeatured && (
                                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-blue-400 font-semibold">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{product.sku}</td>
                      <td className="py-3.5 px-4 text-slate-400">{product.category?.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{formatPrice(product.salePrice || product.price)}</div>
                        {product.salePrice && (
                          <div className="text-[10px] text-slate-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3" /> Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" /> {product.stockQuantity} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" /> {product.stockQuantity} in stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            product.isActive
                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Deactivate/Delete"
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

      {/* Modal */}
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
