import Link from "next/link";
import {
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

export const metadata = {
  title: "Refund & Return Policy | Kharidly",
  description:
    "Kharidly's refund and return policy — hassle-free returns on eligible items across Pakistan.",
};

const steps = [
  {
    title: "Contact us on WhatsApp",
    text: "Message us with your order number and a short video or photos showing the issue.",
  },
  {
    title: "We verify your request",
    text: "Our team reviews your request, usually within 24 hours on working days.",
  },
  {
    title: "Return or replacement",
    text: "Once approved, we arrange a replacement or process your refund to your bank account.",
  },
];

const eligible = [
  "Product arrived damaged or defective",
  "Wrong item delivered",
  "Product does not match its description",
];

const notEligible = [
  "Damage caused by misuse, drops, or water exposure",
  "Items returned without original packaging and accessories",
  "Change-of-mind requests after the product has been used",
];

export default function RefundPolicyPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            Our Promise
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Refund &amp; <span className="text-[#f97316]">Return Policy</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Changed your mind or received a faulty item? Here is exactly how
            returns and refunds work at Kharidly.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Intro card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              7-Day Easy Returns
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We offer hassle-free returns on eligible items within{" "}
            <strong className="text-slate-900">7 days of delivery</strong>. If
            your product arrives damaged, defective, or simply not as
            described, we will make it right — with a replacement or a refund.
          </p>
        </div>

        {/* Eligible / not eligible */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" /> Eligible for
              return
            </h3>
            <ul className="space-y-3">
              {eligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 mb-4">Not covered</h3>
            <ul className="space-y-3">
              {notEligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600"
                >
                  <XCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">
            How to request a return
          </h2>
          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f97316] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund method */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            How refunds are paid
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Approved refunds are transferred directly to your bank account
            within 3–5 working days. For Cash on Delivery orders, we will ask
            for your bank account details on WhatsApp to complete the refund.
            Delivery charges are non-refundable unless the return is due to our
            mistake.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#f97316] rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Need to start a return?</h2>
          <p className="mt-2 text-sm text-orange-50">
            Message us on WhatsApp with your order number — a real human will
            help you.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#ea580c] font-bold px-6 py-3 rounded-full text-sm hover:bg-orange-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
