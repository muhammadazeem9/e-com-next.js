import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import HeroSlider from "@/components/HeroSlider";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <HeroSlider />

      {/* feature sectin */}
      <section className="mx-auto max-w-[1600px] px-5 pt-16 md:px-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Autumn 26</h2>
          <Link href="/products" className="text-sm text-ash hover:text-ink">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-1 gap-y-10 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
