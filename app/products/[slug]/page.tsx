import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type ProductPageProps = PageProps<"/products/[slug]">;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const stockBySize = (size: string) =>
    product.variants
      .filter((v) => v.size === size)
      .reduce((sum, v) => sum + v.stock, 0);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/products"
        className="text-sm text-neutral-500 hover:text-black"
      >
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Product image placeholder */}
        <div className="space-y-4">
          {product.images.map((image, index) => (
            <div
              key={image.url}
              className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {/* Product information */}
        <div className="md:sticky md:top-8 md:self-start">
          {product.collectionName && (
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              {product.collectionName}
            </p>
          )}

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            {product.name}
          </h1>

          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>

          <p className="mt-6 leading-7 text-neutral-600">
            {product.description}
          </p>

          {/* Colors */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Colors
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  aria-label={color.name}
                  className="h-6 w-6 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Sizes and stock */}
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Sizes
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const stock = stockBySize(size);
                const isOutOfStock = stock === 0;

                return (
                  <span
                    key={size}
                    title={isOutOfStock ? "Out of stock" : `${stock} available`}
                    aria-disabled={isOutOfStock}
                    className={`border px-3 py-2 text-sm ${
                      isOutOfStock
                        ? "text-neutral-300 line-through"
                        : "text-neutral-800"
                    }`}
                  >
                    {size}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
