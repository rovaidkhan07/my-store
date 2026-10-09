import React from "react";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-sans text-gray-900"><AdminShell>{children}</AdminShell></div>;
}



