import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 p-4">
        <Link href="/">
          <p className="font-bold">Storefront</p>
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-600 hover:text-black"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
