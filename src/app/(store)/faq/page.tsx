"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

const faqs = [
  {
    q: "Are your products 100% genuine?",
    a: "Yes. Every product on Kharidly is 100% original and quality-checked before dispatch. We never sell copies or replicas.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched quickly and delivery usually takes a few working days depending on your city. You'll be able to track your order live once it's shipped.",
  },
  {
    q: "What are the delivery charges?",
    a: "Delivery is FREE on all orders above PKR 3,000. A small flat delivery fee applies to orders below that amount, shown at checkout.",
  },
  {
    q: "How can I pay for my order?",
    a: "We accept direct bank transfer. After placing your order, you'll receive our bank account details to complete the payment.",
  },
  {
    q: "What is your return policy?",
    a: "We offer hassle-free returns on eligible items. If your product arrives damaged or defective, contact us on WhatsApp with your order number and we'll sort it out right away.",
  },
  {
    q: "How do I track my order?",
    a: "After checkout you'll receive a secure tracking token. Enter it on the Track Your Order page to view live shipment progress at any time.",
  },
  {
    q: "Do products come with warranty?",
    a: "Eligible products carry warranty as stated on their product page. For any warranty claim, reach out to us on WhatsApp with your order number.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about shopping with Kharidly.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#262C37] text-slate-500 dark:text-[#8A919C]"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed border-t border-slate-100 dark:border-[#262C37] pt-4">
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-10 bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Still have a question?
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Message us on WhatsApp — a real human will reply.
          </p>
          <a
            href={buildWhatsAppSupportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-primary hover:bg-accent text-white font-bold text-sm px-8 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

