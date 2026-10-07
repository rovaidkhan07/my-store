import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-md">
        The accessory, product or page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] font-bold">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop" className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Browse All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
