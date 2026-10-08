import React from "react";
import { Header } from "@/components/storefront/header";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-button";
import { CartProvider } from "@/hooks/use-cart";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0F1115] text-slate-900 dark:text-[#D5D9E0] font-sans antialiased">
        <Header />
        <main className="flex-1 pb-44 lg:pb-0">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloatingButton />
        <MobileBottomNav />
      </div>
    </CartProvider>
  );
}



