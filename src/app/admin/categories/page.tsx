"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CategoryWithCount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { Layers, Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-500" /> Categories Management ({categories.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize mobile accessories into user-friendly storefront categories.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Sort Order</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const productCount = cat._count?.products ?? 0;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                            <Image
                              src={
                                cat.imageUrl ||
                                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                              }
                              alt={cat.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white">{cat.name}</div>
                            {cat.description && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{cat.slug}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-bold">{cat.sortOrder}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-400">{productCount} items</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cat.isActive
                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl text-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingCategory ? `Edit: ${editingCategory.name}` : "Create Category"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
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
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="e.g. Chargers & Adapters"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                  placeholder="e.g. chargers"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                    />
                    <span className="font-bold">Active in Store</span>
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
                <Button type="submit" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
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
