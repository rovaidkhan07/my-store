import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/productService";
import { productSchema } from "@/lib/validations/product";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
    const validated = productSchema.parse(body);

    const updated = await updateProduct(id, validated);
    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Failed", details: error }, { status: 400 });
    }
    console.error("Failed to update product:", error);
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
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deactivated/deleted" });
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
