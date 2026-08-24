import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createOrderAtomic, listOrders } from "@/lib/services/orderService";
import { getAdminSession, getCustomerSession } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    const customerSession = await getCustomerSession();
    const order = await createOrderAtomic(validated, customerSession?.id);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      const issues = (error as any).issues || (error as any).errors || [];
      issues.forEach((err: any) => {
        const path = Array.isArray(err.path) ? err.path.join(".") : "";
        if (path) fieldErrors[path] = err.message;
      });
      const firstMessage = issues[0]?.message || "Invalid order information";
      return NextResponse.json(
        {
          error: firstMessage,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Order creation failed:", error);
    const msg = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listOrders({ status, paymentStatus, search, page, limit });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
