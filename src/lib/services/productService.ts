import { prisma } from "../prisma";
import { FilterParams, ProductWithDetails } from "@/types";
import { ProductFormValues } from "../validations/product";
import { Prisma } from "@/generated/prisma/client";

export async function getProducts(params: FilterParams = {}) {
  const {
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    inStock,
    featured,
    sort = "featured",
    page = 1,
    limit = 24,
  } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = {
      slug: category,
      isActive: true,
    };
  }

  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { sku: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock) {
    where.stockQuantity = { gt: 0 };
  }

  if (featured) {
    where.isFeatured = true;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  switch (sort) {
    case "price-low-high":
      orderBy = { price: "asc" };
      break;
    case "price-high-low":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "best-selling":
      orderBy = { orderItems: { _count: "desc" } };
      break;
    case "featured":
    default:
      orderBy = { isFeatured: "desc" };
      break;
  }

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products as ProductWithDetails[],
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return product as ProductWithDetails | null;
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return product as ProductWithDetails | null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products as ProductWithDetails[];
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductWithDetails[]> {
  const include = {
    category: true,
    images: {
      orderBy: { sortOrder: "asc" },
    },
    variants: {
      where: { isActive: true },
    },
  };

  // First: products from the same category
  const sameCategory = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: excludeId },
    },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  // Fallback: fill remaining slots with newest products from other categories
  // so the section never appears empty
  if (sameCategory.length < limit) {
    const more = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: [excludeId, ...sameCategory.map((p) => p.id)] },
      },
      include,
      take: limit - sameCategory.length,
      orderBy: { createdAt: "desc" },
    });
    return [...sameCategory, ...more] as ProductWithDetails[];
  }

  return sameCategory as ProductWithDetails[];
}

export async function getDistinctBrands(): Promise<string[]> {
  const brands = await prisma.product.findMany({
    where: { isActive: true },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });

  return brands.map((b) => b.brand).filter(Boolean);
}

export async function createProduct(data: ProductFormValues) {
  const { images, variants, ...productData } = data;

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || productData.name,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
      },
    });

    if (variants && variants.length > 0) {
      for (const v of variants) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            name: v.name,
            sku: v.sku,
            price: v.price || null,
            stockQuantity: v.stockQuantity,
            attributes: v.attributes,
            isActive: v.isActive ?? true,
          },
        });
      }
    }

    if (product.stockQuantity > 0) {
      await tx.inventoryTransaction.create({
        data: {
          productId: product.id,
          quantity: product.stockQuantity,
          transactionType: "purchase",
          referenceId: "INITIAL_STOCK",
          notes: "Initial inventory during product creation",
        },
      });
    }

    return product;
  });
}

export async function updateProduct(id: string, data: ProductFormValues) {
  const { images, variants, ...productData } = data;

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existing) throw new Error("Product not found");

    // Update main fields
    await tx.product.update({
      where: { id },
      data: productData,
    });

    // Replace images
    await tx.productImage.deleteMany({ where: { productId: id } });
    if (images && images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((img, idx) => ({
          productId: id,
          imageUrl: img.imageUrl,
          altText: img.altText || productData.name,
          sortOrder: img.sortOrder ?? idx,
        })),
      });
    }

    // Handle variants update
    if (variants) {
      const existingVariantIds = existing.variants.map((v) => v.id);
      const incomingVariantIds = variants.filter((v) => v.id).map((v) => v.id as string);

      // Deactivate removed variants
      const toDeactivate = existingVariantIds.filter((vid) => !incomingVariantIds.includes(vid));
      if (toDeactivate.length > 0) {
        await tx.productVariant.updateMany({
          where: { id: { in: toDeactivate } },
          data: { isActive: false },
        });
      }

      // Upsert incoming variants
      for (const v of variants) {
        if (v.id && existingVariantIds.includes(v.id)) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              name: v.name,
              sku: v.sku,
              price: v.price || null,
              stockQuantity: v.stockQuantity,
              attributes: v.attributes,
              isActive: v.isActive ?? true,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              name: v.name,
              sku: v.sku,
              price: v.price || null,
              stockQuantity: v.stockQuantity,
              attributes: v.attributes,
              isActive: v.isActive ?? true,
            },
          });
        }
      }
    }

    return await tx.product.findUnique({
      where: { id },
      include: { images: true, variants: true, category: true },
    });
  });
}

export async function deleteProduct(id: string) {
  // Check if product is in any orders
  const orderItemCount = await prisma.orderItem.count({
    where: { productId: id },
  });

  if (orderItemCount > 0) {
    // Soft deactivation to preserve historical order snapshots
    return await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Hard delete if never ordered
  return await prisma.product.delete({
    where: { id },
  });
}
