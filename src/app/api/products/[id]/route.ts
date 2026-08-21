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
    const msg = error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ error: msg }, { status: 500 });
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
    const msg = error instanceof Error ? error.message : "Failed to update product";
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
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deactivated/deleted" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
