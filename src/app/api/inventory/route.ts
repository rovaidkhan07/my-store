import { NextResponse } from "next/server";
import { listInventory, adjustStock } from "@/lib/services/inventoryService";
import { inventoryAdjustSchema } from "@/lib/validations/inventory";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") as any) || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    const result = await listInventory({ search, status, page, limit });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch inventory";
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
    const validated = inventoryAdjustSchema.parse(body);
    const result = await adjustStock(validated);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to adjust inventory";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
