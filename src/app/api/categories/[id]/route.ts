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
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Failed", details: error }, { status: 400 });
    }
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
