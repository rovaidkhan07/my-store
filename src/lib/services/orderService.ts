import { prisma } from "../prisma";
import { CheckoutFormValues } from "../validations/checkout";
import { STORE_CONFIG } from "../config/store";
import { generateOrderNumber } from "../utils";
import { OrderWithDetails } from "@/types";
import { Prisma } from "@/generated/prisma/client";

export async function createOrderAtomic(data: CheckoutFormValues) {
  const { customerName, customerPhone, customerEmail, shippingAddress, city, postalCode, notes, paymentMethod, items } = data;

  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 1. Fetch authoritative product and variant data from DB
  const productIds = items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { variants: true },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // 2. Validate availability, stock, and calculate authoritative pricing
  let calculatedSubtotal = 0;
  const validatedItems: {
    productId: string;
    variantId?: string | null;
    productNameSnapshot: string;
    skuSnapshot: string;
    variantSnapshot?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[] = [];

  for (const item of items) {
    const dbProduct = productMap.get(item.productId);
    if (!dbProduct) {
      throw new Error(`Product not found or currently unavailable.`);
    }

    let unitPrice = dbProduct.salePrice && dbProduct.salePrice > 0 ? dbProduct.salePrice : dbProduct.price;
    let skuSnapshot = dbProduct.sku;
    let variantSnapshot: string | null = null;
    let availableStock = dbProduct.stockQuantity;

    if (item.variantId) {
      const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId && v.isActive);
      if (!dbVariant) {
        throw new Error(`Selected option for "${dbProduct.name}" is no longer available.`);
      }
      skuSnapshot = dbVariant.sku;
      variantSnapshot = dbVariant.name;
      if (dbVariant.price && dbVariant.price > 0) {
        unitPrice = dbVariant.price;
      }
      availableStock = dbVariant.stockQuantity;
    }

    if (availableStock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${dbProduct.name}" ${variantSnapshot ? `(${variantSnapshot})` : ""}. Only ${availableStock} available in stock.`
      );
    }

    const itemTotalPrice = unitPrice * item.quantity;
    calculatedSubtotal += itemTotalPrice;

    validatedItems.push({
      productId: item.productId,
      variantId: item.variantId || null,
      productNameSnapshot: dbProduct.name,
      skuSnapshot,
      variantSnapshot,
      quantity: item.quantity,
      unitPrice,
      totalPrice: itemTotalPrice,
    });
  }

  // 3. Calculate delivery fee & totals
  const deliveryFee =
    calculatedSubtotal >= STORE_CONFIG.freeDeliveryThreshold
      ? 0
      : STORE_CONFIG.defaultDeliveryFee;

  const total = calculatedSubtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  // 4. Atomic Database Transaction
  const createdOrder = await prisma.$transaction(async (tx) => {
    // A. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        shippingAddress,
        city,
        postalCode: postalCode || null,
        subtotal: calculatedSubtotal,
        deliveryFee,
        discount: 0,
        total,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
        notes: notes || null,
        items: {
          create: validatedItems.map((vi) => ({
            productId: vi.productId,
            variantId: vi.variantId,
            productNameSnapshot: vi.productNameSnapshot,
            skuSnapshot: vi.skuSnapshot,
            variantSnapshot: vi.variantSnapshot,
            quantity: vi.quantity,
            unitPrice: vi.unitPrice,
            totalPrice: vi.totalPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // B. Decrement stock & record inventory transactions
    for (const item of validatedItems) {
      // Main product stock decrement
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });

      // Variant stock decrement if applicable
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Record inventory transaction
      await tx.inventoryTransaction.create({
        data: {
          productId: item.productId,
          variantId: item.variantId,
          quantity: -item.quantity,
          transactionType: "sale",
          referenceId: orderNumber,
          notes: `Sold in order ${orderNumber}`,
        },
      });
    }

    return order;
  });

  return createdOrder as unknown as OrderWithDetails;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderWithDetails | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return order as unknown as OrderWithDetails | null;
}

export async function getOrderById(id: string): Promise<OrderWithDetails | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      customer: true,
    },
  });

  return order as unknown as OrderWithDetails | null;
}

export async function trackOrder(orderNumber: string, phone: string) {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/\D/g, "");

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: cleanOrderNum,
      customerPhone: {
        contains: cleanPhone.slice(-7), // Match last 7 digits to tolerate phone formats
      },
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return order as unknown as OrderWithDetails | null;
}

export async function listOrders(params: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const { status, paymentStatus, search, page = 1, limit = 20 } = params;

  const where: Prisma.OrderWhereInput = {};

  if (status && status !== "all") {
    where.orderStatus = status;
  }

  if (paymentStatus && paymentStatus !== "all") {
    where.paymentStatus = paymentStatus;
  }

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { orderNumber: { contains: term, mode: "insensitive" } },
      { customerName: { contains: term, mode: "insensitive" } },
      { customerPhone: { contains: term, mode: "insensitive" } },
      { customerEmail: { contains: term, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders as unknown as OrderWithDetails[],
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateOrderStatus(orderId: string, status: string, notes?: string) {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!existing) throw new Error("Order not found");

  // If cancelling an order, restore inventory
  if (status === "cancelled" && existing.orderStatus !== "cancelled") {
    await prisma.$transaction(async (tx) => {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            transactionType: "return",
            referenceId: existing.orderNumber,
            notes: `Restored stock due to cancelled order ${existing.orderNumber}`,
          },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: status,
          notes: notes ? `${existing.notes || ""}\n[Cancelled]: ${notes}`.trim() : existing.notes,
        },
      });
    });
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: status,
        notes: notes ? `${existing.notes || ""}\n[Status Update]: ${notes}`.trim() : existing.notes,
      },
    });
  }

  return await getOrderById(orderId);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });
}
