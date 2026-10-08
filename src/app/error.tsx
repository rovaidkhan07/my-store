"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Storefront Runtime Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-border rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            Connection Interrupted
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The server encountered a temporary delay connecting to the store database.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full bg-card text-foreground hover:bg-accent hover:text-white text-white font-bold text-xs rounded-full h-11 shadow-md gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-border text-slate-900 font-bold text-xs rounded-full h-11 gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" /> Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

