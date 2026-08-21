import { NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/lib/services/settingsService";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const settings = await updateStoreSettings(body);

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
