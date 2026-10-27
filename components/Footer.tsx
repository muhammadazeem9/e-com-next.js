import { cacheLife } from "next/cache";
import Link from "next/link";
export default async function Footer() {
  "use cache";
  cacheLife("days");
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-5 pb-6 pt-16 md:px-8">
        <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <Link href="/products" className="hover:text-ash">
            Shop
          </Link>
          <Link href="/about" className="hover:text-ash">
            About
          </Link>
          <span className="text-ash">Free returns within 30 days</span>
        </div>
        <p className="display mt-16 text-[clamp(4rem,16vw,10rem)] leading-[0.75]">
          Shoponline
        </p>
        <p className="mt-6 text-xs text-ash">
          © {new Date().getFullYear()} Shoponline
        </p>
      </div>
    </footer>
  );
}
