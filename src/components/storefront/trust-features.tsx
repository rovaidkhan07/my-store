import React from "react";
import { Package, Lightbulb, Smartphone, Truck } from "lucide-react";

export function TrustFeatures() {
  const features = [
    {
      icon: Package,
      title: "Explore Products",
      description: "Browse the latest electronic gadgets and innovative devices.",
    },
    {
      icon: Lightbulb,
      title: "Choose Your Favorites",
      description: "Compare specifications features & prices to select the perfect device easily.",
    },
    {
      icon: Smartphone,
      title: "Secure Checkout",
      description: "Complete your order safely with multiple payment options & secure checkout.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Receive electronics quickly with trusted shipping and tracking.",
    },
  ];

  return (
    <section className="py-20 bg-[#F4F5F7] font-sans">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[11px] font-bold text-gray-800 shadow-sm mb-6 border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            Our Process
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A1A1A] tracking-tight leading-none mb-4">
            Simple Process for Smart Shopping
          </h2>
          <p className="text-[14px] text-gray-500 font-medium">
            Enjoy a smooth and secure shopping experience with simple steps designed to help you discover, order, and receive your favorite electronics quickly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-[88px] h-[88px] rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Icon className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed max-w-[240px]">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
