import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import type { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { CATEGORIES, ProductModel } from "@/models/Product";

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

export type Category = (typeof CATEGORIES)[number];
export type SortKey = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

export type ProductFilters = {
  category?: Category;
  sort: SortKey;
  q?: string;
};

const SORTS: Record<SortKey, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// URL -> safe, typed filters. Anything unknown is ignored.
export function parseFilters(raw: RawParams): ProductFilters {
  const category = first(raw.category);
  const sort = first(raw.sort);
  const q = first(raw.q)?.trim().slice(0, 60);

  return {
    category: CATEGORIES.includes(category as Category)
      ? (category as Category)
      : undefined,
    sort: SORT_OPTIONS.some((option) => option.key === sort)
      ? (sort as SortKey)
      : "newest",
    q: q || undefined,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchProducts(
  filters: ProductFilters,
): Promise<Product[]> {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filters.category) query.category = filters.category;
  if (filters.q) {
    const pattern = new RegExp(escapeRegex(filters.q), "i");
    query.$or = [
      { name: pattern },
      { description: pattern },
      { collectionName: pattern },
    ];
  }

  const docs = await ProductModel.find(query)
    .sort(SORTS[filters.sort])
    .lean<ProductDoc[]>();
  return docs.map(toProduct);
}

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

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  await connectDB();
  const docs = await ProductModel.find()
    .select("slug")
    .lean<{ slug: string }[]>();
  return docs.map((doc) => doc.slug);
}

// Not cached: stock must always be read fresh
export async function getVariantBySku(sku: string): Promise<Variant | null> {
  await connectDB();
  const doc = await ProductModel.findOne(
    { "variants.sku": sku },
    { "variants.$": 1 }, // return only the matching variant
  ).lean<{ variants?: Variant[] }>();

  const v = doc?.variants?.[0];
  return v
    ? { sku: v.sku, size: v.size, color: v.color, stock: v.stock }
    : null;
}
