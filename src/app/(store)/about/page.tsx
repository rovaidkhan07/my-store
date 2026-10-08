import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About Us | Kharidly",
  description:
    "Learn about Kharidly — Pakistan's premium tech store for genuine mobile accessories with nationwide delivery.",
};

const badges = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    text: "Every item is original and quality-checked before dispatch.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "Fast, tracked delivery to every city in Pakistan.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    text: "Hassle-free returns on eligible items, no headaches.",
  },
  {
    icon: MessageCircle,
    title: "Real Human Support",
    text: "Talk to us on WhatsApp anytime for help with your order.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            About Kharidly
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pakistan&apos;s Premium <span className="text-primary">Tech Store</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Genuine mobile accessories, honest prices, and delivery to your
            doorstep — anywhere in Pakistan.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-10 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Our Story
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Kharidly started with a simple frustration: finding{" "}
            <strong className="text-slate-900 dark:text-white">100% genuine</strong> mobile
            accessories in Pakistan is harder than it should be. Markets are
            full of copies that stop working in weeks.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            So we built the store we wished existed — every product hand-picked,
            quality-checked, and backed by real human support. From chargers
            and earbuds to cases and smart gadgets, if it&apos;s on Kharidly,
            it&apos;s the real deal.
          </p>
        </div>
      </div>

      {/* Why Shop With Us */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          Why Shop With Kharidly?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] p-6 text-center shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to upgrade your tech?
          </h2>
          <p className="mt-2 text-white/90 text-sm sm:text-base">
            Browse our collection of premium accessories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-white text-accent font-bold text-sm px-8 py-3.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

