import { prisma } from "../prisma";
import { STORE_CONFIG } from "../config/store";

export async function getStoreSettings(): Promise<Record<string, string>> {
  const dbSettings = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, string> = {
    store_name: STORE_CONFIG.name,
    store_tagline: STORE_CONFIG.tagline,
    store_phone: STORE_CONFIG.phone,
    store_whatsapp: STORE_CONFIG.whatsapp,
    store_email: STORE_CONFIG.email,
    store_address: STORE_CONFIG.address,
    currency: STORE_CONFIG.currency,
    currency_symbol: STORE_CONFIG.currencySymbol,
    delivery_fee: String(STORE_CONFIG.defaultDeliveryFee),
    free_delivery_threshold: String(STORE_CONFIG.freeDeliveryThreshold),
    bank_name: STORE_CONFIG.bankDetails.bankName,
    bank_account_title: STORE_CONFIG.bankDetails.accountTitle,
    bank_account_number: STORE_CONFIG.bankDetails.accountNumber,
    bank_iban: STORE_CONFIG.bankDetails.iban,
  };

  for (const s of dbSettings) {
    settingsMap[s.key] = s.value;
  }

  return settingsMap;
}

export async function updateStoreSettings(settings: Record<string, string>) {
  const updates = Object.entries(settings).map(([key, value]) =>
    prisma.storeSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  );

  await prisma.$transaction(updates);
  return await getStoreSettings();
}
