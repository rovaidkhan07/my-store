import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/lib/services/orderService";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch order";
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
    const { orderStatus, paymentStatus, notes } = body;

    let updatedOrder;

    if (orderStatus) {
      updatedOrder = await updateOrderStatus(id, orderStatus, notes);
    }

    if (paymentStatus) {
      updatedOrder = await updatePaymentStatus(id, paymentStatus);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
