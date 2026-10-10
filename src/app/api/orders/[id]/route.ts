import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/lib/services/orderService";
import { getAdminSession } from "@/lib/auth/jwt";

const ALLOWED_ORDER_STATUSES = new Set([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

const ALLOWED_PAYMENT_STATUSES = new Set([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error("Failed to fetch order:", error);
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
    const body: unknown = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }

    const { orderStatus, paymentStatus, notes } = body as Record<string, unknown>;

    if (
      (orderStatus !== undefined && (typeof orderStatus !== "string" || !ALLOWED_ORDER_STATUSES.has(orderStatus))) ||
      (paymentStatus !== undefined && (typeof paymentStatus !== "string" || !ALLOWED_PAYMENT_STATUSES.has(paymentStatus))) ||
      (notes !== undefined && (typeof notes !== "string" || notes.length > 2000)) ||
      (orderStatus === undefined && paymentStatus === undefined)
    ) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }

    let updatedOrder;

    if (typeof orderStatus === "string") {
      updatedOrder = await updateOrderStatus(id, orderStatus, typeof notes === "string" ? notes : undefined);
    }

    if (typeof paymentStatus === "string") {
      updatedOrder = await updatePaymentStatus(id, paymentStatus);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
