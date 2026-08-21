import { z } from "zod";

// Pakistan mobile number regex: matches 03001234567, +923001234567, 923001234567, 0300-1234567, 0300 1234567
const PAK_PHONE_REGEX = /^((\+92)|(0092)|(92)|0)?3[0-9]{2}[-\s]?[0-9]{7}$/;

function isValidStreetAddress(address: string): boolean {
  const trimmed = address.trim();
  if (trimmed.length < 10) return false;
  // Must contain at least one space (e.g., 'House 14, Street 5')
  if (!trimmed.includes(" ")) return false;
  // Must have vowels or numbers
  const hasVowels = /[aeiouAEIOU]/.test(trimmed);
  const hasNumbers = /\d/.test(trimmed);
  if (!hasVowels && !hasNumbers) return false;
  // Reject long consonant clusters (common in keyboard mash like 'gfry6wrtgfg')
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(trimmed)) {
    return false;
  }
  return true;
}

function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;
  // Only letters, spaces, dots, hyphens, and apostrophes
  if (!/^[a-zA-Z\s'.\-]+$/.test(trimmed)) return false;
  // Must contain at least two words (e.g., 'Muhammad Rovaid' or 'Ali Khan')
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  return words.length >= 2;
}

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name is too long")
    .refine(
      (name) => isValidName(name),
      "Please enter both first and last name (e.g. Muhammad Rovaid, Ali Khan)"
    ),

  customerPhone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        const clean = val.replace(/[-\s]/g, "");
        return PAK_PHONE_REGEX.test(clean);
      },
      "Please enter a valid Pakistani mobile number (e.g. 0300 1234567 or +92 300 1234567)"
    ),

  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address (e.g. name@domain.com)")
    .optional()
    .or(z.literal("")),

  shippingAddress: z
    .string()
    .trim()
    .min(1, "Delivery street address is required")
    .min(10, "Please enter your complete address (House #, Street #, Sector / Area)")
    .max(250, "Address is too long")
    .refine(
      (addr) => isValidStreetAddress(addr),
      "Please provide a realistic delivery address with House/Flat #, Street # and Area (e.g. House 14-B, Street 3, DHA Phase 6)"
    ),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .min(2, "Please enter your city")
    .max(50, "City name is too long")
    .refine(
      (city) => /^[a-zA-Z\s\-]+$/.test(city),
      "City name must only contain letters"
    ),

  postalCode: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^\d{5}$/.test(val),
      "Postal code must be a 5-digit number (e.g. 75500, 54000, 44000)"
    )
    .optional()
    .or(z.literal("")),

  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),

  paymentMethod: z.enum(["cod", "bank_transfer"] as const),

  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        variantId: z.string().nullable().optional(),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Your cart is empty. Please add items to checkout."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const PAKISTAN_MAJOR_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sukkur",
  "Sargodha",
  "Larkana",
  "Sheikhupura",
  "Jhelum",
  "Gujrat",
  "Mardan",
  "Mirpur (AJK)",
  "Muzaffarabad",
  "Rahim Yar Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantt",
  "Dera Ghazi Khan",
] as const;
