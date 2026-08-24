"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CategoryWithCount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  Sparkles,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories?all=true");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate or delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || slugify(formData.name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront Taxonomies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize mobile accessories into user-friendly storefront departments and navigation menus.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-[#FF5500]/25 gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0B0E14] border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                <th className="py-4 px-4">Category Details</th>
                <th className="py-4 px-4">Slug Identifier</th>
                <th className="py-4 px-4">Sort Order</th>
                <th className="py-4 px-4">Active Products</th>
                <th className="py-4 px-4">Storefront Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const productCount = cat._count?.products ?? 0;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 group-hover:border-amber-500/50 transition-colors">
                            <Image
                              src={
                                cat.imageUrl ||
                                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                              }
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{cat.name}</div>
                            {cat.description && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-300">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                          {cat.slug}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-300 font-bold font-mono">
                        #{cat.sortOrder}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1">
                          <Package className="w-3 h-3" /> {productCount} item{productCount !== 1 ? "s" : ""}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                            cat.isActive
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                              : "bg-slate-900 text-slate-400 border-slate-800"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
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

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E14] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl text-slate-100 p-6 space-y-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {editingCategory ? `Edit: ${editingCategory.name}` : "Create New Category"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: val,
                      slug: !editingCategory ? slugify(val) : prev.slug,
                    }));
                  }}
                  required
                  className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"
                  placeholder="e.g. Fast Chargers & Adapters"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  URL Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-800 text-white font-mono rounded-xl"
                  placeholder="chargers"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Category Hero Image URL
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-slate-900 border-slate-800 text-white font-mono text-xs rounded-xl"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {formData.imageUrl && (
                <div className="relative w-full h-32 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl"
                  placeholder="GaN wall adapters, high-wattage desktop chargers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                    Display Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-slate-900 border-slate-800 text-white rounded-xl"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#FF5500] bg-slate-900 border-slate-700"
                    />
                    <span className="font-bold text-emerald-400">Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-[#FF5500] hover:from-amber-400 hover:to-[#FF5500] text-white font-bold px-6 rounded-xl"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
