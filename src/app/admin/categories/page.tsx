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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs mb-1">
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>Storefront Taxonomies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
            Categories ({categories.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Organize mobile accessories into user-friendly storefront departments and navigation menus.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-card text-foreground hover:bg-accent hover:text-white text-white font-bold text-xs px-6 py-3 rounded-full shadow-md hover:shadow-primary/25 gap-2 cursor-pointer transition-all duration-300 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* 1. Mobile Category Cards View (Visible on screens < sm) */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block mr-2" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            No categories found. Click "Add Category" to create one.
          </div>
        ) : (
          categories.map((cat) => {
            const productCount = cat._count?.products ?? 0;
            return (
              <div
                key={cat.id}
                className="p-4 rounded-sm bg-white border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0">
                    <Image
                      src={
                        cat.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                      }
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-gray-950 truncate">{cat.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      /{cat.slug} • Order #{cat.sortOrder}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      cat.isActive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-secondary text-gray-600 border-gray-200"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-xs font-bold text-gray-700 bg-background px-2.5 py-1 rounded-full border border-gray-200">
                    {productCount} products
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-sm bg-background border border-gray-200 text-gray-700 hover:text-black"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* 2. Desktop Categories Table (Visible on sm and above) */}
      <div className="hidden sm:block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider bg-background">
                <th className="py-4 px-4">Category Details</th>
                <th className="py-4 px-4">Slug Identifier</th>
                <th className="py-4 px-4">Sort Order</th>
                <th className="py-4 px-4">Active Products</th>
                <th className="py-4 px-4">Storefront Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const productCount = cat._count?.products ?? 0;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-secondary/80 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0 group-hover:border-black transition-colors">
                            <Image
                              src={
                                cat.imageUrl ||
                                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                              }
                              alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-950 text-xs">{cat.name}</div>
                            {cat.description && (
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-gray-700 font-bold">
                        <span className="bg-background px-2.5 py-1 rounded-sm border border-gray-200 text-xs">
                          {cat.slug}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-700 font-bold font-mono">
                        #{cat.sortOrder}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900 bg-background border border-gray-200 px-3 py-1 rounded-full text-xs inline-flex items-center gap-1.5 shadow-2xs">
                          <Package className="w-3 h-3 text-accent" /> {productCount} item{productCount !== 1 ? "s" : ""}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-secondary text-gray-600 border-gray-200"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-secondary rounded-sm transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-sm w-full max-w-lg shadow-2xl text-gray-900 p-6 space-y-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-background border border-gray-200 flex items-center justify-center text-accent">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-950 text-base">
                  {editingCategory ? `Edit: ${editingCategory.name}` : "Create New Category"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
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
                  className="bg-background border-gray-200 text-gray-900 rounded-sm h-11 focus:bg-white"
                  placeholder="e.g. Fast Chargers & Adapters"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  URL Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-background border-gray-200 text-gray-900 font-mono rounded-sm focus:bg-white"
                  placeholder="chargers"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  Category Hero Image URL
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-background border-gray-200 text-gray-900 font-mono text-xs rounded-sm focus:bg-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {formData.imageUrl && (
                <div className="relative w-full h-32 rounded-sm bg-background border border-gray-200 overflow-hidden">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="bg-background border-gray-200 text-gray-900 rounded-sm focus:bg-white"
                  placeholder="GaN wall adapters, high-wattage desktop chargers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1.5">
                    Display Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-background border-gray-200 text-gray-900 rounded-sm focus:bg-white"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 bg-secondary border-gray-200"
                    />
                    <span className="font-bold text-emerald-700">Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-900 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-card text-foreground hover:bg-accent hover:text-white text-white font-bold px-6 rounded-full shadow-md"
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


