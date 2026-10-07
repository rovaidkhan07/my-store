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
    console.error("Failed to fetch categories:", error);
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
    const validated = categorySchema.parse(body);
    const category = await createCategory(validated);

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Failed", details: error }, { status: 400 });
    }
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

