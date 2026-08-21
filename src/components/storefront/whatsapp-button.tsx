"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";

export function WhatsAppFloatingButton() {
  const url = buildWhatsAppGeneralSupportUrl();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
      </div>
      <span className="hidden md:inline font-bold text-xs">WhatsApp Help</span>
    </a>
  );
}
