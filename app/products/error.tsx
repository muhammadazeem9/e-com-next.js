"use client";

import { useEffect } from "react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // later: send to Sentry
  }, [error]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">
        We couldn&apos;t load the products. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Try again
      </button>
    </section>
  );
}
