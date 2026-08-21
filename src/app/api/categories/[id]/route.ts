import { NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/services/categoryService";
import { categorySchema } from "@/lib/validations/category";
import { getAdminSession } from "@/lib/auth/jwt";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = categorySchema.parse(body);

    const updated = await updateCategory(id, validated);
    return NextResponse.json({ success: true, category: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update category";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteCategory(id);
    return NextResponse.json({ success: true, message: "Category deleted/deactivated" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
