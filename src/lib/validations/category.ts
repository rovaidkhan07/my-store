import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid image URL").optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
