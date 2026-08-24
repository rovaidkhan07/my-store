import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col lg:flex-row relative selection:bg-[#FF5500] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient background glow effects */}
      <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/5 via-[#FF5500]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/5 via-blue-500/5 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

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
