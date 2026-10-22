import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  const heroImage = featured[0]?.images[0];

  return (
    <>
      <section className="relative h-[85svh] min-h-[540px] overflow-hidden bg-fog">
        {heroImage && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-5 text-paper md:px-8">
          <h1 className="display text-[30vw] leading-[0.75] md:text-[23vw]">
            Shoponline
          </h1>
          <div className="mt-5 flex items-end justify-between gap-6">
            <p className="max-w-xs text-sm">
              Autumn 26. Wool, heavy cotton and tailoring cut for the city.
            </p>
            <Link
              href="/products"
              className="border-b border-paper pb-0.5 text-sm"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

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
