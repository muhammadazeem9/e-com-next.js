import Link from "next/link";

export default function Footer() {
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
        <p className="display mt-16 text-[28vw] leading-[0.75] md:text-[20vw]">
          Shoponline
        </p>
        <p className="mt-6 text-xs text-ash">© 2026 Shoponline</p>
      </div>
    </footer>
  );
}
