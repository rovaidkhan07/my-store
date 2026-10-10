import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createOrderAtomic, listOrders } from "@/lib/services/orderService";
import { getAdminSession, getCustomerSession } from "@/lib/auth/jwt";
import { checkoutRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    // Limit to 5 orders per 10 minutes per IP across all Vercel instances.
    const isAllowed = await checkoutRateLimit.check(ip, 5, 10 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const validated = checkoutSchema.parse(body);
    const customerSession = await getCustomerSession();

    const order = await createOrderAtomic({
      ...validated,
      idempotencyKey: validated.idempotencyKey,
      customerId: customerSession?.role === "customer" ? customerSession.id : null,
    });

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

    if (error instanceof Error) {
      if (error.message.includes("Insufficient")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("Idempotency key was already used")) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    const result = await listOrders({ status, paymentStatus, search, page, limit });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
