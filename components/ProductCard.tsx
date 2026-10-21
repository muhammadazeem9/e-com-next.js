import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

const CARD_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const [primary, secondary] = product.images;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt}
              fill
              sizes={CARD_SIZES}
              priority={priority}
              className="object-cover"
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes={CARD_SIZES}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {product.isNewArrival && (
            <span className="absolute left-3 top-3 z-10 bg-black px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
              New
            </span>
          )}
          {onSale && (
            <span className="absolute right-3 top-3 z-10 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-widest">
              Sale
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-neutral-900 group-hover:underline">
              {product.name}
            </h2>
            <p className="mt-1 text-xs capitalize text-neutral-500">
              {product.category}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-neutral-900">
              {formatPrice(product.price)}
            </p>
            {onSale && (
              <p className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-3.5 w-3.5 rounded-full border border-neutral-300"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </Link>
    </article>
  );
}
