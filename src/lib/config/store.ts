export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "MobileHub",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Premium Mobile Accessories at the Right Price",
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || "+92 300 1234567",
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "923001234567",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "support@mobilehub.pk",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Shop 14, Hafeez Center / Techno City, Karachi, Pakistan",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "PKR",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.",
  defaultDeliveryFee: Number(process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_FEE || 200),
  freeDeliveryThreshold: Number(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || 3000),

  bankDetails: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Meezan Bank Ltd.",
    accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "MobileHub Accessories",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "0101-0102030405",
    iban: process.env.NEXT_PUBLIC_BANK_IBAN || "PK00MEZN0001010102030405",
  },
};

export function buildWhatsAppInquiryUrl(productName: string, sku: string): string {
  const cleanNumber = STORE_CONFIG.whatsapp.replace(/\D/g, "");
  const message = `Hello ${STORE_CONFIG.name}, I am interested in purchasing:\n\n*Product:* ${productName}\n*SKU:* ${sku}\n\nIs this available in stock?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppSupportUrl(): string {
  const cleanNumber = STORE_CONFIG.whatsapp.replace(/\D/g, "");
  const message = `Hello ${STORE_CONFIG.name}, I need help with an order or product inquiry.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderSupportUrl(orderNumber: string): string {
  const cleanNumber = STORE_CONFIG.whatsapp.replace(/\D/g, "");
  const message = `Hello ${STORE_CONFIG.name}, I would like to inquire about my order *${orderNumber}*.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export const buildWhatsAppProductInquiryUrl = buildWhatsAppInquiryUrl;
export const buildWhatsAppGeneralSupportUrl = buildWhatsAppSupportUrl;

