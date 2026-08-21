import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/services/categoryService";
import { categorySchema } from "@/lib/validations/category";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const categories = await getCategories(all);
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch categories";
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
    const validated = categorySchema.parse(body);
    const category = await createCategory(validated);

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
