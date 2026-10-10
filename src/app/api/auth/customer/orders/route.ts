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
    const where = { OR: [{ customerId: session.id }, { customerEmail: session.email }] };

    // Fetch orders by customerId OR matching customerEmail
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

    const totalCount = await prisma.order.count({ where });
    return NextResponse.json({ success: true, orders, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Get customer orders error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
