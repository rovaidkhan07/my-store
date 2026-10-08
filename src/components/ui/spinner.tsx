"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small smooth spinner for button loading states. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("w-4 h-4 animate-spin", className)} />;
}

