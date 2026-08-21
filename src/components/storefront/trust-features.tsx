import React from "react";
import { Truck, ShieldCheck, RotateCcw, MessageCircle, Sparkles } from "lucide-react";

export function TrustFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Nationwide Cash on Delivery",
      description: "Pay securely at your doorstep across Karachi, Lahore, Islamabad, & all cities in Pakistan.",
      badge: "COD Available",
    },
    {
      icon: ShieldCheck,
      title: "100% Genuine Brands",
      description: "Direct authentic sourcing from Anker, Baseus, Ugreen, Joyroom, and Apple OEM suppliers.",
      badge: "Verified Retail",
    },
    {
      icon: RotateCcw,
      title: "7-Day Replacement Warranty",
      description: "Hassle-free replacement policy if your accessory encounters any manufacturer defect.",
      badge: "Guaranteed",
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Helpline",
      description: "Real human technical support on WhatsApp to assist with compatibility and tracking.",
      badge: "Fast Reply",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:border-[#FF5500]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF5500]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF8F5] text-slate-700 border border-slate-200">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-950 mb-1.5 uppercase tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
