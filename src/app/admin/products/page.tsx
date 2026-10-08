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

  const [productToDelete, setProductToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs mb-1">
            <Package className="w-3.5 h-3.5 text-accent" />
            <span>Storefront Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
            Products &amp; Pricing ({totalCatalog})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage product specs, pricing, discounted sale values, inventory thresholds, and active status.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-card text-foreground hover:bg-accent hover:text-white text-white font-bold text-xs px-6 py-3 rounded-full shadow-md hover:shadow-primary/25 gap-2 cursor-pointer transition-all duration-300 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 sm:p-4 rounded-sm border text-left transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-black text-white border-black shadow-md"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-950 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Catalog</div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 font-mono">{totalCatalog}</div>
        </button>

        <button
          onClick={() => setStatusFilter("active")}
          className={`p-3.5 sm:p-4 rounded-sm border text-left transition-all cursor-pointer ${
            statusFilter === "active"
              ? "bg-black text-white border-black shadow-md"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-950 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 font-mono">{activeCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("low")}
          className={`p-3.5 sm:p-4 rounded-sm border text-left transition-all cursor-pointer ${
            statusFilter === "low"
              ? "bg-black text-white border-black shadow-md"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-950 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Low Stock</div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 font-mono">{lowStockCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("out")}
          className={`p-3.5 sm:p-4 rounded-sm border text-left transition-all cursor-pointer ${
            statusFilter === "out"
              ? "bg-black text-white border-black shadow-md"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-950 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Out of Stock</div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 font-mono">{outOfStockCount}</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Input
            placeholder="Search by title, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border-gray-200 text-gray-900 placeholder:text-gray-400 pl-9 text-xs rounded-sm h-11 focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -trangray-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-64 h-11 px-3.5 bg-background border border-gray-200 rounded-sm text-xs text-gray-800 font-medium focus:bg-white"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 1. Mobile Cards View (Visible on screens < sm) */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block mr-2" />
            Loading catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            No products match search criteria.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const img =
              product.images?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100";
            const isOutOfStock = product.stockQuantity <= 0;
            const isLowStock =
              product.stockQuantity > 0 &&
              product.stockQuantity <= product.lowStockThreshold;

            return (
              <div
                key={product.id}
                className="p-4 rounded-sm bg-white border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0">
                    <Image src={img} alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-gray-950 line-clamp-1">{product.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                      {product.brand} • {product.sku}
                    </div>
                    <div className="text-xs font-black text-gray-950 font-mono mt-1">
                      {formatPrice(product.salePrice || product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div>
                    {isOutOfStock ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Low: {product.stockQuantity}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {product.stockQuantity} In Stock
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-secondary text-gray-600 border-gray-200"
                      }`}
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </button>

                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 rounded-sm bg-background border border-gray-200 text-gray-700 hover:text-black"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(product.id, product.name)}
                      className="p-1.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Products Table (Visible on sm and above) */}
      <div className="hidden sm:block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider bg-background">
                <th className="py-4 px-4">Product Details</th>
                <th className="py-4 px-4">SKU / Brand</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price &amp; Sale</th>
                <th className="py-4 px-4">Warehouse Stock</th>
                <th className="py-4 px-4">Active</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      <span>Loading products catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
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
                      className="hover:bg-secondary/80 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0 group-hover:border-black transition-colors">
                            <Image
                              src={img}
                              alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-950 line-clamp-1 flex items-center gap-1.5">
                              <span>{product.name}</span>
                              {product.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-background text-gray-900 border border-gray-200 text-[10px] font-bold">
                                  <Sparkles className="w-2.5 h-2.5 text-accent" /> Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2 font-medium">
                              <span>{product.brand}</span>
                              {product.variants && product.variants.length > 0 && (
                                <span className="text-accent font-bold">
                                  • {product.variants.length} variants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Brand */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-gray-700 font-bold bg-background px-2.5 py-1 rounded-sm border border-gray-200 text-[11px]">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="text-gray-700 font-semibold">
                          {product.category?.name || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="font-black text-gray-950 font-mono text-xs">
                          {formatPrice(product.salePrice || product.price)}
                        </div>
                        {product.salePrice && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-400 line-through font-mono">
                              {formatPrice(product.price)}
                            </span>
                            {discountPercent && (
                              <span className="text-[9px] font-bold text-accent bg-orange-50 px-1 py-0.5 rounded">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Warehouse Stock */}
                      <td className="py-4 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> 0 Units (Out)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> {product.stockQuantity} Left (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {product.stockQuantity} In Stock
                          </span>
                        )}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                            product.isActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200"
                              : "bg-secondary text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800"
                          }`}
                          title="Click to toggle active status"
                        >
                          {product.isActive ? "Active" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-black hover:bg-secondary rounded-sm transition-colors cursor-pointer"
                            title="View on Live Store"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-secondary rounded-sm transition-colors cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id, product.name)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
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

      {/* Custom Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isDeleting && setProductToDelete(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Are you sure you want to completely remove <span className="font-bold text-gray-800">&quot;{productToDelete.name}&quot;</span>? This action cannot be undone and will remove it from the customer storefront.
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-rose-600 text-white hover:bg-rose-700 font-bold border-none"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


