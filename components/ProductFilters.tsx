import Form from "next/form";
import Link from "next/link";
import { CATEGORIES } from "@/models/Product";
import { SORT_OPTIONS, type ProductFilters as Filters } from "@/lib/products";
import { buildHref } from "@/lib/url";

const BASE = "/products";

export default function ProductFilters({ filters }: { filters: Filters }) {
  const params = {
    category: filters.category,
    sort: filters.sort === "newest" ? undefined : filters.sort,
    q: filters.q,
  };

  const linkClass = (active: boolean) =>
    active ? "border-b border-ink text-ink" : "text-ash hover:text-ink";

  return (
    <div className="mt-8 space-y-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Categories" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href={buildHref(BASE, { ...params, category: undefined })}
            className={linkClass(!filters.category)}
          >
            All
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={buildHref(BASE, { ...params, category })}
              className={`capitalize ${linkClass(filters.category === category)}`}
            >
              {category}
            </Link>
          ))}
        </nav>

        <Form action={BASE} className="flex items-center gap-3">
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
          {params.sort && (
            <input type="hidden" name="sort" value={params.sort} />
          )}
          <label htmlFor="q" className="sr-only">
            Search pieces
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search pieces"
            className="w-48 border-b border-ink/30 bg-transparent py-1 placeholder:text-ash focus:border-ink focus:outline-none"
          />
        </Form>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-ash">Sort</span>
        {SORT_OPTIONS.map((option) => (
          <Link
            key={option.key}
            href={buildHref(BASE, {
              ...params,
              sort: option.key === "newest" ? undefined : option.key,
            })}
            className={linkClass(filters.sort === option.key)}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
