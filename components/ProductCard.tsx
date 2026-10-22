import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

const CARD_SIZES = "(min-width: 768px) 25vw, 50vw";

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const onSale =
    !!product.compareAtPrice && product.compareAtPrice > product.price;
  const [primary, secondary] = product.images;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-fog">
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
          {(product.isNewArrival || onSale) && (
            <span className="absolute left-2 top-2 z-10 bg-paper px-2 py-0.5 text-xs">
              {onSale ? "Sale" : "New"}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-3 text-sm">
          <h2 className="font-medium">{product.name}</h2>
          <p className={onSale ? "text-cobalt" : ""}>
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="text-sm text-ash">
          {product.colors.length}{" "}
          {product.colors.length === 1 ? "color" : "colors"}
        </p>
      </Link>
    </article>
  );
}
