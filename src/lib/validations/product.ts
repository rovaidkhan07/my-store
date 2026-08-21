import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(2, "Variant SKU is required"),
  price: z.number().nullable().optional(),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").default(0),
  attributes: z.string().default("{}"),
  isActive: z.boolean().default(true),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().url("Must be a valid image URL"),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  salePrice: z.number().positive("Sale price must be greater than 0").nullable().optional(),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(productImageSchema).min(1, "At least one image is required"),
  variants: z.array(variantSchema).optional().default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
