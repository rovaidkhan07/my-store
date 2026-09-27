import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { PixelScripts } from "@/components/analytics/pixel-scripts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MobileHub | Premium Mobile Accessories & Fast Charging in Pakistan",
    template: "%s | MobileHub",
  },
  description:
    "Buy authentic mobile accessories in Pakistan. GaN fast chargers, heavy-duty braided cables, high-capacity power banks, MagSafe cases and 9H tempered glass with Cash on Delivery.",
  keywords: [
    "mobile accessories pakistan",
    "fast charger karachi",
    "anker charger",
    "baseus 65w gan",
    "type c cable",
    "power bank",
    "iphone 15 pro max case",
    "cash on delivery accessories",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={null}>
          <PixelScripts />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
