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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10) || 25));

    const result = await listInventory({ search, status, page, limit });
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Failed", details: error }, { status: 400 });
    }
    console.error("Failed to adjust inventory:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 400 });
  }
}
