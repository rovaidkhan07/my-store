import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your orders." },
        { status: 401 }
      );
    }

    // Fetch orders by customerId OR matching customerEmail
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: session.id },
          { customerEmail: session.email },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Get customer orders error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
