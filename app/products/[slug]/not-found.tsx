import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link
        href="/products"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        Browse all products
      </Link>
    </section>
  );
}
