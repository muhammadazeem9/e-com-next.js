import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { searchProducts, type ProductFilters } from "@/lib/products";

export default async function ProductGrid({
  filters,
}: {
  filters: ProductFilters;
}) {
  const products = await searchProducts(filters);

  if (products.length === 0) {
    return (
      <div className="py-24">
        <p className="text-xl font-medium">No pieces match your search.</p>
        <Link
          href="/products"
          className="mt-3 inline-block border-b border-ink text-sm"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="mb-5 text-sm text-ash">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
      </p>
      <div className="grid grid-cols-2 gap-x-1 gap-y-10 md:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}
