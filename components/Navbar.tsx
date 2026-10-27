import { readCart } from "@/lib/cart";
import Link from "next/link";
import { Suspense } from "react";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

async function BagCount() {
  const lines = await readCart();
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <Link href="/cart" className="hover:text-ash">
      Bag ({count})
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="display text-3xl">
          Shoponline
        </Link>
        <div className="flex items-center gap-8 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ash">
              {link.label}
            </Link>
          ))}
          <Suspense fallback={<span>Bag</span>}>
            <BagCount />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
