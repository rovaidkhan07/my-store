import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-next-pathname") || "";

  // If login page, allow rendering without auth redirection
  const session = await getAdminSession();

  // If on admin route (other than login) and not authenticated, we redirect in pages or layout
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
