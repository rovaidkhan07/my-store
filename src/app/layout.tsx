import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { PixelScripts } from "@/components/analytics/pixel-scripts";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Kharidly | Premium Electronics & Tech Gadgets in Pakistan",
    template: "%s | Kharidly",
  },
  description:
    "Buy authentic tech gadgets and mobile accessories in Pakistan at kharidly.pk. GaN fast chargers, heavy-duty cables, power banks, and premium audio with Cash on Delivery.",
  icons: {
    icon: "/logo/favicon.png",
  },
  keywords: [
    "mobile accessories pakistan",
    "fast charger karachi",
    "anker charger",
    "baseus 65w gan",
    "type c cable",
    "power bank",
    "wireless earbuds",
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
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Suspense fallback={null}>
          <PixelScripts />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


