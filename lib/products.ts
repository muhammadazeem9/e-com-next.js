import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import type { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";

export type Variant = {
  sku: string;
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // cents
  compareAtPrice?: number;
  category: string;
  collectionName?: string;
  images: { url: string; alt: string }[];
  colors: { name: string; hex: string }[];
  variants: Variant[];
  featured: boolean;
  isNewArrival: boolean;
};

// Shape of what Mongoose .lean() returns
type ProductDoc = Omit<
  Product,
  "id" | "images" | "featured" | "isNewArrival"
> & {
  _id: Types.ObjectId;
  images?: { url: string; alt?: string }[];
  featured?: boolean;
  isNewArrival?: boolean;
};

function toProduct(doc: ProductDoc): Product {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    compareAtPrice: doc.compareAtPrice,
    category: doc.category,
    collectionName: doc.collectionName,
    images: (doc.images ?? []).map((img) => ({
      url: img.url,
      alt: img.alt ?? "",
    })),
    colors: (doc.colors ?? []).map((c) => ({ name: c.name, hex: c.hex })),
    variants: (doc.variants ?? []).map((v) => ({
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock: v.stock,
    })),
    featured: doc.featured ?? false,
    isNewArrival: doc.isNewArrival ?? false,
  };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  await connectDB();
  const docs = await ProductModel.find()
    .sort({ createdAt: -1 })
    .lean<ProductDoc[]>();
  return docs.map(toProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  await connectDB();
  const docs = await ProductModel.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ProductDoc[]>();
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  await connectDB();
  const doc = await ProductModel.findOne({ slug }).lean<ProductDoc>();
  return doc ? toProduct(doc) : null;
}
