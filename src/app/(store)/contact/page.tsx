import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import {
  buildWhatsAppSupportUrl,
  STORE_CONFIG,
} from "@/lib/config/store";

export const metadata = {
  title: "Contact Us | Kharidly",
  description:
    "Contact Kharidly — Pakistan's premium tech store. Reach us on WhatsApp, email, or phone for orders and support.",
};

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();

  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      text: "Fastest response — a real human, not a bot.",
      value: STORE_CONFIG.phone,
      href: whatsappUrl,
      cta: "Chat now",
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      text: "For order issues, returns, and business inquiries.",
      value: STORE_CONFIG.email,
      href: `mailto:${STORE_CONFIG.email}`,
      cta: "Send email",
      external: false,
    },
    {
      icon: Phone,
      title: "Phone",
      text: "Call us during working hours.",
      value: STORE_CONFIG.phone,
      href: `tel:${STORE_CONFIG.phone.replace(/\s/g, "")}`,
      cta: "Call now",
      external: false,
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#fb923c] mb-4">
            We&apos;re Here To Help
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Questions about an order, a product, or a return? Talk to a real
            human — we actually reply.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Channels */}
        <div className="grid sm:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm flex flex-col"
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                <ch.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">{ch.title}</h3>
              <p className="text-xs text-slate-500 dark:text-[#8A919C] mt-1 flex-1">{ch.text}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-[#D5D9E0] mt-3 break-all">
                {ch.value}
              </p>
              <a
                href={ch.href}
                {...(ch.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-4 inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
              >
                {ch.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Hours + address */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Working hours</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
              Monday – Saturday, 10 AM – 8 PM (PKT).
              <br />
              WhatsApp messages are usually answered within a few hours.
            </p>
          </div>
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Store address</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
              {STORE_CONFIG.address}
            </p>
          </div>
        </div>

        {/* Big WhatsApp CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">
            The fastest way to reach us
          </h2>
          <p className="mt-2 text-sm text-orange-50">
            One tap — tell us your order number and what you need.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-accent font-bold px-8 py-3 rounded-full text-sm hover:bg-orange-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Open WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );
}

