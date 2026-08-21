"use client";

import React, { useState } from "react";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { X, Plus, Trash2, Image as ImageIcon, Sparkles } from "lucide-react";

interface VariantFormItem {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stockQuantity: string;
  attributes: string;
}

interface ProductFormModalProps {
  product?: ProductWithDetails | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({
  product,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    sku: string;
    brand: string;
    description: string;
    categoryId: string;
    price: string;
    salePrice: string;
    stockQuantity: string;
    lowStockThreshold: string;
    isFeatured: boolean;
    isActive: boolean;
    images: string[];
    variants: VariantFormItem[];
  }>({
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    brand: product?.brand || "Anker",
    description: product?.description || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    price: product?.price ? String(product.price) : "",
    salePrice: product?.salePrice ? String(product.salePrice) : "",
    stockQuantity: product?.stockQuantity !== undefined ? String(product.stockQuantity) : "10",
    lowStockThreshold: product?.lowStockThreshold !== undefined ? String(product.lowStockThreshold) : "5",
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    images: product?.images?.map((img) => img.imageUrl) || [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    ],
    variants: (product?.variants?.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price ? String(v.price) : "",
      stockQuantity: String(v.stockQuantity),
      attributes: v.attributes || "{}",
    })) || []) as VariantFormItem[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEditing ? slugify(name) : prev.slug,
    }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleImageChange = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = val;
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddVariant = () => {
    const nextNum = formData.variants.length + 1;
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: `Variant ${nextNum}`,
          sku: `${formData.sku || "VAR"}-0${nextNum}`,
          price: "",
          stockQuantity: "5",
          attributes: JSON.stringify({ Option: `Option ${nextNum}` }),
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const cleanImages = formData.images.filter((img) => img.trim() !== "");
      if (cleanImages.length === 0) {
        throw new Error("At least one product image URL is required");
      }

      const payload = {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        sku: formData.sku,
        brand: formData.brand,
        description: formData.description,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        images: cleanImages.map((url, idx) => ({
          imageUrl: url,
          altText: formData.name,
          sortOrder: idx,
        })),
        variants: formData.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price ? Number(v.price) : null,
          stockQuantity: parseInt(v.stockQuantity, 10) || 0,
          attributes: v.attributes,
        })),
      };

      const url = isEditing ? `/api/products/${product?.id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 animate-in fade-in-50">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? `Edit Product: ${product?.name}` : "Create New Product"}
            </h2>
            <p className="text-xs text-slate-400">Fill in product information, pricing, images and variants</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Product Title *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="e.g. Anker 20W USB-C Fast Wall Charger"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                SKU *
              </label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white font-mono"
                placeholder="e.g. ANK-CHG-020W"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Brand *
              </label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="e.g. Anker, Baseus, Ugreen"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                URL Slug
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Product Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Key features, wattage specs, device compatibility..."
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Regular Price (PKR) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="2999"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Sale Price (PKR)
              </label>
              <Input
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="2499"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <Input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                Low Stock Alert *
              </label>
              <Input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Checkbox options */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
              />
              <span className="font-bold">Featured on Home Page</span>
            </label>

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

          {/* Image URLs */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" /> Product Images (URLs)
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image URL
              </button>
            </div>

            <div className="space-y-2">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Product Variants (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            {formData.variants.length > 0 && (
              <div className="space-y-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <Input
                      placeholder="Variant Name (e.g. 2m Black)"
                      value={v.name}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Input
                      placeholder="Variant SKU"
                      value={v.sku}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[idx].sku = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="bg-slate-800 border-slate-700 text-white font-mono"
                    />
                    <Input
                      placeholder="Price Override"
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[idx].price = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Stock"
                        type="number"
                        value={v.stockQuantity}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].stockQuantity = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-slate-500 hover:text-rose-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
              {isEditing ? "Save Product Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
