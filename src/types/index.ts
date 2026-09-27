import {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  StoreSetting,
} from "@/generated/prisma/client";

export type { ProductVariant };

export type ProductWithDetails = Product & {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Product;
    variant: ProductVariant | null;
  })[];
};

export type CategoryWithCount = Category & {
  _count?: {
    products: number;
  };
};

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  brand: string;
  slug: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  regularPrice: number;
  quantity: number;
  stockQuantity: number;
  variantName?: string;
  variantAttributes?: Record<string, string>;
}

export interface FilterParams {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sort?: "featured" | "newest" | "price-low-high" | "price-high-low" | "best-selling";
  page?: number;
  limit?: number;
}
