import type { Metadata } from "next";
import { Suspense } from "react";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { parseFilters } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse outerwear, tops, bottoms, dresses and accessories.",
};

export default function Products({ searchParams }: PageProps<"/products">) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 md:px-8">
      <h1 className="display text-[18vw] md:text-[10vw]">Shop</h1>

      <Suspense fallback={<ProductGridSkeleton />}>
        <Shop searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Shop({
  searchParams,
}: {
  searchParams: PageProps<"/products">["searchParams"];
}) {
  const filters = parseFilters(await searchParams);

  return (
    <>
      <ProductFilters filters={filters} />
      <Suspense
        key={JSON.stringify(filters)}
        fallback={<ProductGridSkeleton />}
      >
        <ProductGrid filters={filters} />
      </Suspense>
    </>
  );
}
