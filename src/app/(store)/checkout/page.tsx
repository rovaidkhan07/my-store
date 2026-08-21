import React from "react";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata = {
  title: "Secure Checkout | MobileHub",
  description: "Complete your order with Cash on Delivery or Bank Transfer.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
