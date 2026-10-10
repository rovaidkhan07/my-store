import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your orders." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rawPage = Number(searchParams.get("page") ?? "1");
    const rawLimit = Number(searchParams.get("limit") ?? "20");
    const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isSafeInteger(rawLimit) ? Math.min(50, Math.max(1, rawLimit)) : 20;
    const where = { customerId: session.id };

    // Only return orders explicitly associated with the authenticated customer ID.
    const orders = await prisma.order.findMany({
      where,
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
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    const [totals, statuses] = await Promise.all([
      prisma.order.aggregate({ where, _count: { _all: true }, _sum: { total: true } }),
      prisma.order.groupBy({ by: ["orderStatus"], where, _count: { _all: true } }),
    ]);
    const totalCount = totals._count._all;
    const deliveredOrders = statuses.find((status) => status.orderStatus === "delivered")?._count._all ?? 0;
    const pendingOrders = statuses
      .filter((status) => status.orderStatus !== "delivered" && status.orderStatus !== "cancelled")
      .reduce((sum, status) => sum + status._count._all, 0);
    return NextResponse.json({
      success: true,
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      metrics: { totalSpent: totals._sum.total ?? 0, pendingOrders, deliveredOrders },
    });
  } catch (error: unknown) {
    console.error("Get customer orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
