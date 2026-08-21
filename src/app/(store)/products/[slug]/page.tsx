import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/productService";
import { ProductDetailView } from "@/components/product/product-detail-view";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | MobileHub" };
  }

  return {
    title: `${product.name} | MobileHub`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
