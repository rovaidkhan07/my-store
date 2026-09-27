import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TRACKING_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string" || !TRACKING_TOKEN_PATTERN.test(token)) {
      return NextResponse.json(
        { error: "Tracking link is invalid or has expired." },
        { status: 404, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const order = await prisma.order.findUnique({
      where: { trackingToken: tokenHash },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Tracking link is invalid or has expired." },
        { status: 404, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    // Explicitly select and return ONLY non-sensitive tracking information.
    return NextResponse.json(
      {
        order: {
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          items: order.items.map((item) => ({
            id: item.id,
            productNameSnapshot: item.productNameSnapshot,
            variantSnapshot: item.variantSnapshot,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: unknown) {
    console.error("Failed to track order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
