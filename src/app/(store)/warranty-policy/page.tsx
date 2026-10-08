import Link from "next/link";
import {
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

export const metadata = {
  title: "Warranty Policy | Kharidly",
  description:
    "Kharidly's warranty policy — genuine products backed by straightforward warranty coverage across Pakistan.",
};

const covered = [
  "Manufacturing defects out of the box",
  "Faulty charging, buttons, or connectivity within the warranty period",
  "Battery or performance issues not caused by misuse",
];

const notCovered = [
  "Physical damage from drops, impacts, or pressure",
  "Water, moisture, or liquid damage",
  "Damage from unauthorized repair or modification",
  "Normal wear and tear (cables fraying, cosmetic scratches)",
];

export default function WarrantyPolicyPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            Buy With Confidence
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Warranty <span className="text-primary">Policy</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Every genuine product deserves genuine protection. Here is what our
            warranty covers — in plain words.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Intro card */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Straightforward coverage
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            Eligible products carry warranty for the period stated on their
            product page. Because we only sell{" "}
            <strong className="text-slate-900 dark:text-white">100% genuine products</strong>,
            warranty claims are simple: no fine-print games, no runaround —
            just contact us and we will sort it out.
          </p>
        </div>

        {/* Covered / not covered */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-orange-600" /> What&apos;s
              covered
            </h3>
            <ul className="space-y-3">
              {covered.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-[#8A919C]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4">
              What&apos;s not covered
            </h3>
            <ul className="space-y-3">
              {notCovered.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-[#8A919C]"
                >
                  <XCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claim process */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
            How to claim warranty
          </h2>
          <div className="space-y-5">
            {[
              {
                title: "Message us on WhatsApp",
                text: "Send your order number plus a short video or photos showing the fault.",
              },
              {
                title: "We diagnose the issue",
                text: "Our team checks whether the fault is covered — usually within 24 hours on working days.",
              },
              {
                title: "Repair or replacement",
                text: "Covered faults get a free repair or a replacement unit, with return shipping on us.",
              },
            ].map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-[#8A919C] mt-1">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            Keep your order number safe — it is your warranty reference. Claims
            made after the stated warranty period cannot be accepted.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Facing an issue?</h2>
          <p className="mt-2 text-sm text-orange-50">
            Reach out on WhatsApp with your order number — we respond fast.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-accent font-bold px-6 py-3 rounded-full text-sm hover:bg-orange-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Claim Warranty
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

