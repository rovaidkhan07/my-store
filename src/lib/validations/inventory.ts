import { z } from "zod";

export const inventoryAdjustSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().nullable().optional(),
  quantityChange: z.number().int().refine((val) => val !== 0, "Quantity adjustment cannot be zero"),
  transactionType: z.enum(["purchase", "sale", "adjustment", "return", "damaged", "manual_update"]),
  notes: z.string().min(3, "Please provide a reason for the stock adjustment"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const settingsSchema = z.object({
  store_name: z.string().min(2),
  store_tagline: z.string().optional(),
  store_phone: z.string().min(5),
  store_whatsapp: z.string().min(5),
  store_email: z.string().email(),
  store_address: z.string().min(5),
  delivery_fee: z.string(),
  free_delivery_threshold: z.string(),
  bank_name: z.string().optional(),
  bank_account_title: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_iban: z.string().optional(),
});
