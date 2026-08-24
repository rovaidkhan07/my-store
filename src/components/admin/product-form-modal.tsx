"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify, formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Package,
  AlertCircle,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "media" | "variants">("general");

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
    name: "",
    slug: "",
    sku: "",
    brand: "Anker",
    description: "",
    categoryId: "",
    price: "",
    salePrice: "",
    stockQuantity: "15",
    lowStockThreshold: "5",
    isFeatured: false,
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    ],
    variants: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        sku: product.sku || "",
        brand: product.brand || "Anker",
        description: product.description || "",
        categoryId: product.categoryId || categories[0]?.id || "",
        price: product.price ? String(product.price) : "",
        salePrice: product.salePrice ? String(product.salePrice) : "",
        stockQuantity:
          product.stockQuantity !== undefined ? String(product.stockQuantity) : "15",
        lowStockThreshold:
          product.lowStockThreshold !== undefined ? String(product.lowStockThreshold) : "5",
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
        images:
          product.images && product.images.length > 0
            ? product.images.map((img) => img.imageUrl)
            : ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"],
        variants:
          product.variants?.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price ? String(v.price) : "",
            stockQuantity: String(v.stockQuantity),
            attributes: v.attributes || "{}",
          })) || [],
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        sku: "",
        brand: "Anker",
        description: "",
        categoryId: categories[0]?.id || "",
        price: "",
        salePrice: "",
        stockQuantity: "15",
        lowStockThreshold: "5",
        isFeatured: false,
        isActive: true,
        images: [
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
        ],
        variants: [],
      });
    }
    setActiveTab("general");
    setError(null);
  }, [product, categories, isOpen]);

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
          sku: `${formData.sku || "SKU"}-V${nextNum}`,
          price: "",
          stockQuantity: "10",
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl text-slate-900 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xs shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                {isEditing ? `Edit: ${product?.name}` : "Create New Product"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Configure specs, pricing, images and inventory rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-black rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-200 flex items-center gap-2 bg-[#FAF8F5] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "general"
                ? "border-black text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            General Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "pricing"
                ? "border-black text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Pricing &amp; Stock
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "media"
                ? "border-black text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Media Images</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white border border-stone-200 text-slate-700 font-mono">
              {formData.images.filter((i) => i.trim()).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("variants")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "variants"
                ? "border-black text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Variants</span>
            {formData.variants.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF5500] text-white font-bold">
                {formData.variants.length}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: General */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Product Title *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl h-11 focus:bg-white"
                  placeholder="e.g. Anker 735 65W GaN III Fast Wall Charger"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    SKU Code *
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                    className="bg-[#FAF8F5] border-stone-200 text-slate-900 font-mono rounded-2xl focus:bg-white"
                    placeholder="ANK-GAN-065W"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Brand Name *
                  </label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl focus:bg-white"
                    placeholder="Anker, Baseus, Ugreen"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-10 px-3.5 bg-[#FAF8F5] border border-stone-200 rounded-2xl text-slate-900 text-xs focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  URL Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-[#FAF8F5] border-stone-200 text-slate-900 font-mono rounded-2xl text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Full Product Description &amp; Specifications *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="bg-[#FAF8F5] border-stone-200 text-slate-900 rounded-2xl text-xs leading-relaxed focus:bg-white"
                  placeholder="Output wattage, fast charge protocols (PD 3.0, QC 4.0), ports, compatibility with iPhone and Android..."
                />
              </div>

              {/* Status Toggles */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-black bg-stone-100 border-stone-300"
                  />
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" /> Featured on Homepage
                  </span>
                </label>

                <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 bg-stone-100 border-stone-300"
                  />
                  <span className="font-bold text-emerald-700">Published &amp; Active in Store</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Pricing & Stock */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <label className="block text-slate-800 font-bold uppercase tracking-wider">
                    Regular Price (PKR) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="bg-white border-stone-200 text-slate-950 font-mono text-base font-bold rounded-2xl h-11"
                    placeholder="6499"
                  />
                  <p className="text-[11px] text-slate-500">
                    Standard listing price before any promotional discount.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <label className="block text-slate-800 font-bold uppercase tracking-wider">
                    Sale / Discounted Price (PKR)
                  </label>
                  <Input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="bg-white border-stone-200 text-[#FF5500] font-mono text-base font-bold rounded-2xl h-11"
                    placeholder="5499"
                  />
                  <p className="text-[11px] text-slate-500">
                    Optional. Displays crossed-out original price with discount tag.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <label className="block text-slate-800 font-bold uppercase tracking-wider">
                    Initial Warehouse Stock *
                  </label>
                  <Input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                    className="bg-white border-stone-200 text-slate-950 font-mono text-base font-bold rounded-2xl h-11"
                    placeholder="25"
                  />
                  <p className="text-[11px] text-slate-500">
                    Units available for sale. Automatically decrements upon customer orders.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <label className="block text-slate-800 font-bold uppercase tracking-wider">
                    Low Stock Warning Threshold *
                  </label>
                  <Input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, lowStockThreshold: e.target.value })
                    }
                    required
                    className="bg-white border-stone-200 text-amber-700 font-mono text-base font-bold rounded-2xl h-11"
                    placeholder="5"
                  />
                  <p className="text-[11px] text-slate-500">
                    Triggers a low-stock alert when available stock drops below this number.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Media Images */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-slate-800 font-bold uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#FF5500]" /> Product Image URLs
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    First image will serve as the primary storefront product card visual
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddImage}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-stone-100 text-slate-900 border-stone-200 text-xs font-bold gap-1.5 rounded-full"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Image
                </Button>
              </div>

              <div className="space-y-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-3xl bg-[#FAF8F5] border border-stone-200"
                  >
                    {/* Live Preview Thumbnail */}
                    <div className="relative w-12 h-12 rounded-2xl bg-white border border-stone-200 overflow-hidden shrink-0">
                      {img ? (
                        <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Input
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/... or image CDN link"
                        className="bg-white border-stone-200 text-slate-900 font-mono text-xs h-10 rounded-xl"
                      />
                    </div>

                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Variants */}
          {activeTab === "variants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-slate-800 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5500]" /> Product Variants (Color, Length, Wattage)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Optional variations customers can select on the product detail page
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-stone-100 text-slate-900 border-stone-200 text-xs font-bold gap-1.5 rounded-full"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </Button>
              </div>

              {formData.variants.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-3xl border border-dashed border-stone-200 text-slate-500">
                  No variants added. This product will be listed as a single base SKU.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase">
                            Variant Title
                          </label>
                          <Input
                            placeholder="e.g. 2m Black"
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="bg-white border-stone-200 text-slate-900 text-xs h-9 mt-1 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase">
                            Variant SKU
                          </label>
                          <Input
                            placeholder="SKU-2M-BLK"
                            value={v.sku}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].sku = e.target.value;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="bg-white border-stone-200 text-slate-900 font-mono text-xs h-9 mt-1 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase">
                            Price Override
                          </label>
                          <Input
                            placeholder="Base price"
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].price = e.target.value;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="bg-white border-stone-200 text-slate-900 text-xs h-9 mt-1 rounded-xl"
                          />
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase">
                              Stock Units
                            </label>
                            <Input
                              placeholder="10"
                              type="number"
                              value={v.stockQuantity}
                              onChange={(e) => {
                                const updated = [...formData.variants];
                                updated[idx].stockQuantity = e.target.value;
                                setFormData({ ...formData, variants: updated });
                              }}
                              className="bg-white border-stone-200 text-slate-900 text-xs h-9 mt-1 rounded-xl"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors h-9"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 rounded-full"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-black hover:bg-[#FF5500] text-white font-bold px-8 h-12 rounded-full shadow-md hover:shadow-[#FF5500]/25 transition-all duration-300 cursor-pointer"
              >
                {isEditing ? "Save Product Changes" : "Create Product in Catalog"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
