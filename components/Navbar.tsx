import Link from "next/link";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

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
          <span>Bag (0)</span>
        </div>
      </nav>
    </header>
  );
}
