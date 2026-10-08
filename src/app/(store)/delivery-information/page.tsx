import Link from "next/link";
import {
  Truck,
  PackageCheck,
  Timer,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import {
  buildWhatsAppSupportUrl,
  STORE_CONFIG,
} from "@/lib/config/store";

export const metadata = {
  title: "Delivery Information | Kharidly",
  description:
    "Kharidly's delivery information — fast nationwide shipping, tracking, and delivery charges across Pakistan.",
};

export default function DeliveryInformationPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  const freeThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const deliveryFee = STORE_CONFIG.defaultDeliveryFee;

  const cards = [
    {
      icon: Timer,
      title: "Dispatch time",
      text: "Orders placed before 3 PM are usually dispatched the same working day. Orders placed later ship the next working day.",
    },
    {
      icon: Truck,
      title: "Delivery timeframe",
      text: "Delivery typically takes 2–4 working days for major cities and 3–5 working days for remote areas across Pakistan.",
    },
    {
      icon: PackageCheck,
      title: "Live tracking",
      text: "After checkout you receive a secure tracking token. Enter it on the Track Your Order page to follow your parcel live.",
    },
    {
      icon: MapPin,
      title: "Nationwide coverage",
      text: "We deliver to every city and town in Pakistan through trusted courier partners.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            Fast &amp; Tracked
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Delivery <span className="text-[#f97316]">Information</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            How fast, how much, and where we deliver — everything about getting
            your order to your doorstep.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Charges highlight */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Delivery charges
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 text-center">
              <p className="text-2xl font-extrabold text-[#ea580c]">FREE</p>
              <p className="text-xs text-slate-600 mt-1">
                On all orders above Rs. {freeThreshold.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Rs. {deliveryFee}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Flat fee on orders below Rs. {freeThreshold.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            The exact delivery fee for your order is always shown at checkout
            before you pay — no surprises.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Payment note */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
            Payment on delivery
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            We offer <strong className="text-slate-900 dark:text-white">Cash on Delivery</strong>{" "}
            and <strong className="text-slate-900 dark:text-white">direct bank transfer</strong>.
            For bank transfer orders, your parcel is dispatched as soon as your
            payment is confirmed — just send us the transfer slip on WhatsApp
            with your order number.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#f97316] rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Question about delivery?</h2>
          <p className="mt-2 text-sm text-orange-50">
            Message us on WhatsApp — we will check your parcel status right
            away.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#ea580c] font-bold px-6 py-3 rounded-full text-sm hover:bg-orange-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Track Your Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
