import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col lg:flex-row relative selection:bg-[#FF5500] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient warm lighting orbs matching storefront */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#FF5500]/10 to-amber-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tl from-stone-200/50 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
