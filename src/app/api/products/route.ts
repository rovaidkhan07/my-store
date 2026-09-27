import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services/productService";
import { productSchema } from "@/lib/validations/product";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const search = searchParams.get("search") || undefined;
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";
    const sort = (searchParams.get("sort") as any) || "featured";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10) || 24));

    const result = await getProducts({
      category,
      brand,
      search,
      inStock,
      featured,
      sort,
      minPrice,
      maxPrice,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
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
    const validated = productSchema.parse(body);
    const product = await createProduct(validated);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation Failed", details: error }, { status: 400 });
    }
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
