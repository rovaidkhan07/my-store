import { NextResponse } from "next/server";
import { removeCustomerSessionCookie } from "@/lib/auth/jwt";

export async function POST() {
  try {
    await removeCustomerSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
