import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

async function FeaturedProducts() {
  const featured = (await getProducts()).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((product) => (
        <ProductCard key={product.id} product={product} priority />
      ))}
    </div>
  );
}

function FeaturedProductsFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-64 animate-pulse rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everyday essentials, made simple
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Quality basics for your daily life, with fast shipping and easy
            returns.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Shop all products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured</h2>

        <Suspense fallback={<FeaturedProductsFallback />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </div>
  );
}
