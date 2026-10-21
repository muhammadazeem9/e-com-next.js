import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-600">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Go home
      </Link>
    </section>
  );
}
