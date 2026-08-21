import { prisma } from "../prisma";
import { CategoryFormValues } from "../validations/category";

export async function getCategories(includeInactive = false) {
  return await prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });
}

export async function createCategory(data: CategoryFormValues) {
  return await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  return await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    // If category has products, soft de-activate to prevent foreign key errors
    return await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  return await prisma.category.delete({
    where: { id },
  });
}
