import { prisma } from "../prisma";
import { Prisma } from "@/generated/prisma/client";

export async function listInventory(params: {
  search?: string;
  status?: "all" | "low" | "out" | "in";
  page?: number;
  limit?: number;
} = {}) {
  const { search, status = "all", page = 1, limit = 25 } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { sku: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
    ];
  }

  if (status === "out") {
    where.stockQuantity = 0;
  } else if (status === "low") {
    // low stock: stockQuantity > 0 AND stockQuantity <= lowStockThreshold
    where.AND = [
      { stockQuantity: { gt: 0 } },
      // lowStockThreshold comparison via raw or filter
    ];
  } else if (status === "in") {
    where.stockQuantity = { gt: 5 };
  }

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        inventoryHistories: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { stockQuantity: "asc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function adjustStock(data: {
  productId: string;
  variantId?: string | null;
  quantityChange: number;
  transactionType: "purchase" | "sale" | "adjustment" | "return" | "damaged" | "manual_update";
  notes: string;
}) {
  const { productId, variantId, quantityChange, transactionType, notes } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Update product main stock
    const dbProduct = await tx.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error("Product not found");

    if (quantityChange < 0 && dbProduct.stockQuantity < Math.abs(quantityChange)) {
      throw new Error(`Insufficient stock. Cannot reduce by ${Math.abs(quantityChange)}.`);
    }

    const updatedProducts = await tx.product.updateMany({
      where: { id: productId, ...(quantityChange < 0 ? { stockQuantity: { gte: Math.abs(quantityChange) } } : {}) },
      data: { stockQuantity: { increment: quantityChange } },
    });

    if (updatedProducts.count === 0) {
      throw new Error("Failed to update stock due to concurrent modification.");
    }

    const product = await tx.product.findUnique({ where: { id: productId } });

    // 2. Update variant stock if specified
    if (variantId) {
      const dbVariant = await tx.productVariant.findUnique({ where: { id: variantId } });
      if (dbVariant) {
        if (quantityChange < 0 && dbVariant.stockQuantity < Math.abs(quantityChange)) {
          throw new Error("Insufficient variant stock.");
        }
        await tx.productVariant.updateMany({
          where: { id: variantId, ...(quantityChange < 0 ? { stockQuantity: { gte: Math.abs(quantityChange) } } : {}) },
          data: { stockQuantity: { increment: quantityChange } },
        });
      }
    }

    // 3. Record transaction
    const history = await tx.inventoryTransaction.create({
      data: {
        productId,
        variantId: variantId || null,
        quantity: quantityChange,
        transactionType,
        notes,
      },
    });

    return { product, history };
  });
}

export async function getLowStockAlerts() {
  // Find products where stock is <= lowStockThreshold
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
      },
    },
  });

  const lowStock = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);
  return lowStock;
}
