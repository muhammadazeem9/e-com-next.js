import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of everyday essentials.",
};

export default async function Products() {
  const products = await getProducts();
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 md:px-8">
      <h1 className="display text-[18vw] md:text-[10vw]">Shop</h1>
      <p className="mt-4 text-sm text-ash">{products.length} pieces</p>

      <div className="mt-10 grid grid-cols-2 gap-x-1 gap-y-10 md:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>
    </section>
  );
}
