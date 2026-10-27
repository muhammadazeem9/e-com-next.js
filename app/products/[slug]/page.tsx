import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug, getProductSlugs } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToBag from "@/components/AddToBag";

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

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 md:px-8">
      <Link href="/products" className="text-sm text-ash hover:text-ink">
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Product images */}
        <div className="space-y-4">
          {product.images.map((image, index) => (
            <div
              key={image.url}
              className="relative aspect-[3/4] overflow-hidden bg-fog"
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
        <div className="md:sticky md:top-24 md:self-start">
          {product.collectionName && (
            <p className="text-sm text-ash">{product.collectionName}</p>
          )}

          <h1 className="mt-2 text-3xl font-semibold text-ink">
            {product.name}
          </h1>

          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>

          <p className="mt-6 max-w-md leading-7 text-ink">
            {product.description}
          </p>

          <AddToBag colors={product.colors} variants={product.variants} />
        </div>
      </div>
    </section>
  );
}
