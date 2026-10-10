import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/lib/services/orderService";
import { getAdminSession } from "@/lib/auth/jwt";

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
    const body = await req.json();
    const { orderStatus, paymentStatus, notes } = body;
    const allowedOrderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (
      (orderStatus !== undefined && !allowedOrderStatuses.includes(orderStatus)) ||
      (paymentStatus !== undefined && !allowedPaymentStatuses.includes(paymentStatus)) ||
      (notes !== undefined && typeof notes !== "string") ||
      (orderStatus === undefined && paymentStatus === undefined)
    ) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }
    const allowedOrderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (
      !body || typeof body !== "object" ||
      (orderStatus !== undefined && !allowedOrderStatuses.includes(orderStatus)) ||
      (paymentStatus !== undefined && !allowedPaymentStatuses.includes(paymentStatus)) ||
      (notes !== undefined && typeof notes !== "string") ||
      (orderStatus === undefined && paymentStatus === undefined)
    ) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }

    let updatedOrder;

    if (orderStatus) {
      updatedOrder = await updateOrderStatus(id, orderStatus, notes);
    }

    if (paymentStatus) {
      updatedOrder = await updatePaymentStatus(id, paymentStatus);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
