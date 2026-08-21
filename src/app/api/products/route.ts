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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

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
    const msg = error instanceof Error ? error.message : "Failed to fetch products";
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
    const validated = productSchema.parse(body);
    const product = await createProduct(validated);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
