import { prisma } from "../prisma";
import { CheckoutFormValues } from "../validations/checkout";
import { STORE_CONFIG } from "../config/store";
import { generateOrderNumber } from "../utils";
import { OrderWithDetails } from "@/types";
import { Prisma } from "@/generated/prisma/client";
import crypto from "crypto";

type CheckoutInput = CheckoutFormValues & {
  idempotencyKey?: string;
  customerId?: string | null;
};

type IdempotencyKeyParts = {
  rawKey: string;
  requestHash: string;
};

function createCheckoutFingerprint(data: CheckoutInput) {
  const normalizedItems = data.items
    .map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
    }))
    .sort((a, b) => `${a.productId}:${a.variantId ?? ""}`.localeCompare(`${b.productId}:${b.variantId ?? ""}`));

  return crypto
    .createHash("sha256")
    .update(JSON.stringify({
      customerId: data.customerId ?? null,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.replace(/\D/g, ""),
      customerEmail: data.customerEmail?.trim().toLowerCase() || "",
      shippingAddress: data.shippingAddress.trim(),
      city: data.city.trim(),
      postalCode: data.postalCode?.trim() || "",
      paymentMethod: data.paymentMethod,
      items: normalizedItems,
    }))
    .digest("hex");
}

function parseStoredIdempotencyKey(storedKey: string | null): IdempotencyKeyParts | null {
  if (!storedKey) return null;
  const separator = storedKey.indexOf(".");
  if (separator <= 0 || separator === storedKey.length - 1) return null;
  return {
    rawKey: storedKey.slice(0, separator),
    requestHash: storedKey.slice(separator + 1),
  };
}

function getStoredRequestHash(order: { idempotencyKey: string | null; idempotencyRequestHash: string | null }) {
  return order.idempotencyRequestHash ?? parseStoredIdempotencyKey(order.idempotencyKey)?.requestHash ?? null;
}

function getTrackingEncryptionKey(): Buffer | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  return crypto
    .createHash("sha256")
    .update(`kharidly:tracking-token:v1:${secret}`)
    .digest();
}

function encryptTrackingToken(token: string): string {
  const key = getTrackingEncryptionKey();
  if (!key) {
    throw new Error("Missing JWT_SECRET environment variable. Cannot protect tracking token securely.");
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

function decryptTrackingToken(payload: string | null): string | null {
  if (!payload) return null;

  const key = getTrackingEncryptionKey();
  if (!key) return null;

  const parts = payload.split(".");
  if (parts.length !== 3) return null;

  try {
    const [ivPart, tagPart, ciphertextPart] = parts;
    const iv = Buffer.from(ivPart, "base64url");
    const tag = Buffer.from(tagPart, "base64url");
    const ciphertext = Buffer.from(ciphertextPart, "base64url");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

function toCustomerOrderResponse(order: OrderWithDetails, customerTrackingToken: string | null) {
  const internalOrder = order as OrderWithDetails & {
    trackingTokenCiphertext?: string | null;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
  };

  const {
    trackingTokenCiphertext: _trackingTokenCiphertext,
    idempotencyKey: _idempotencyKey,
    idempotencyRequestHash: _idempotencyRequestHash,
    ...safeOrder
  } = internalOrder;

  return {
    ...safeOrder,
    trackingToken: customerTrackingToken,
  };
}

async function findOrderForIdempotencyKey(rawKey: string) {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { idempotencyKey: rawKey },
        { idempotencyKey: { startsWith: `${rawKey}.` } },
      ],
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    take: 3,
  });

  return (
    orders.find((order) => order.idempotencyKey === rawKey) ??
    orders.find((order) => parseStoredIdempotencyKey(order.idempotencyKey)?.rawKey === rawKey) ??
    null
  );
}

export async function createOrderAtomic(data: CheckoutInput) {
  const {
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    city,
    postalCode,
    notes,
    paymentMethod,
    items,
    idempotencyKey,
  } = data;

  const checkoutFingerprint = idempotencyKey ? createCheckoutFingerprint(data) : undefined;

  if (idempotencyKey) {
    const existingOrder = await findOrderForIdempotencyKey(idempotencyKey);

    if (existingOrder) {
      const storedRequestHash = getStoredRequestHash(existingOrder);
      if (!storedRequestHash || storedRequestHash !== checkoutFingerprint) {
        throw new Error("Idempotency key was already used with a different checkout request.");
      }

      return toCustomerOrderResponse(
        existingOrder as unknown as OrderWithDetails,
        decryptTrackingToken(existingOrder.trackingTokenCiphertext)
      );
    }
  }

  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { variants: true },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

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
      throw new Error("Product not found or currently unavailable.");
    }

    let unitPrice = dbProduct.salePrice && dbProduct.salePrice > 0 ? dbProduct.salePrice : dbProduct.price;
    let skuSnapshot = dbProduct.sku;
    let variantSnapshot: string | null = null;
    let availableStock = dbProduct.stockQuantity;

    if (dbProduct.variants.length > 0 && !item.variantId) {
      throw new Error(`Product "${dbProduct.name}" requires a variant to be selected.`);
    }

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

  validatedItems.sort((a, b) => a.productId.localeCompare(b.productId));

  const deliveryFee =
    calculatedSubtotal >= STORE_CONFIG.freeDeliveryThreshold
      ? 0
      : STORE_CONFIG.defaultDeliveryFee;

  const total = calculatedSubtotal + deliveryFee;
  const orderNumber = generateOrderNumber();
  const customerTrackingToken = crypto.randomBytes(32).toString("base64url");
  const trackingToken = crypto.createHash("sha256").update(customerTrackingToken).digest("hex");
  const trackingTokenCiphertext = encryptTrackingToken(customerTrackingToken);

  try {
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerId || null,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          shippingAddress,
          city,
          postalCode: postalCode || null,
          trackingToken,
          trackingTokenCiphertext,
          idempotencyKey: idempotencyKey || null,
          idempotencyRequestHash: checkoutFingerprint || null,
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

      for (const item of validatedItems) {
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.count === 0) {
          throw new Error(`Insufficient stock for "${item.productNameSnapshot}". Purchase failed.`);
        }

        if (item.variantId) {
          const updatedVariant = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (updatedVariant.count === 0) {
            throw new Error(`Insufficient stock for "${item.productNameSnapshot} (${item.variantSnapshot})". Purchase failed.`);
          }
        }

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

    return toCustomerOrderResponse(createdOrder as unknown as OrderWithDetails, customerTrackingToken);
  } catch (error: any) {
    if (error?.code === "P2002" && idempotencyKey) {
      const existingOrder = await findOrderForIdempotencyKey(idempotencyKey);
      if (existingOrder) {
        const storedRequestHash = getStoredRequestHash(existingOrder);
        if (!storedRequestHash || storedRequestHash !== checkoutFingerprint) {
          throw new Error("Idempotency key was already used with a different checkout request.");
        }

        return toCustomerOrderResponse(
          existingOrder as unknown as OrderWithDetails,
          decryptTrackingToken(existingOrder.trackingTokenCiphertext)
        );
      }
    }
    throw error;
  }
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
        contains: cleanPhone.slice(-7),
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

  if (status === "cancelled" && existing.orderStatus !== "cancelled") {
    await prisma.$transaction(async (tx) => {
      const updateResult = await tx.order.updateMany({
        where: { id: orderId, orderStatus: { not: "cancelled" } },
        data: {
          orderStatus: status,
          notes: notes ? `${existing.notes || ""}\n[Cancelled]: ${notes}`.trim() : existing.notes,
        },
      });

      if (updateResult.count === 0) {
        return;
      }

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
