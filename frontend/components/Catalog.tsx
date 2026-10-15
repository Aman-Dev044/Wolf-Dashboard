import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ShopToolbar } from "./ShopToolbar";
import { Reveal } from "./motion";
import type { Category, ProductList } from "@/lib/types";

const GROUPS = [
  { key: "mobile-phones", label: "Mobile Phones" },
  { key: "accessories", label: "Accessories" },
  { key: "other", label: "More" },
] as const;

export function Catalog({
  list,
  categories,
  activeSlug,
  activeGroup,
  basePath,
  searchParams,
}: {
  list: ProductList;
  categories: Category[];
  activeSlug?: string;
  activeGroup?: string;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const from = list.total ? (list.page - 1) * list.limit + 1 : 0;
  const to = Math.min(list.total, list.page * list.limit);
  const pageHref = (page: number) => {
    const sp = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => v && k !== "page" && sp.set(k, v));
    if (page > 1) sp.set("page", String(page));
    return `${basePath}${sp.size ? `?${sp}` : ""}`;
  };

  return (
    <section className="bg-mist py-12 lg:py-16">
      <div className="container-wolf grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <Reveal variant="left" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <aside aria-label="Product categories">
          <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-6 lg:overflow-visible lg:rounded-[24px] lg:bg-white lg:p-6 lg:ring-1 lg:ring-black/5">
            <Link
              href="/shop/"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium lg:block lg:rounded-xl ${
                !activeSlug && !activeGroup ? "bg-ink text-amber" : "bg-white text-heading ring-1 ring-black/5 hover:text-amber lg:ring-0"
              }`}
            >
              All Category
            </Link>
            {GROUPS.map((g) => {
              const items = categories.filter((c) => c.group === g.key);
              if (!items.length) return null;
              return (
                <div key={g.key} className="contents lg:block">
                  <Link
                    href={`/shop/?group=${g.key}`}
                    className={`hidden text-xs font-semibold tracking-[1px] uppercase lg:mb-2 lg:block ${activeGroup === g.key ? "text-amber" : "text-muted hover:text-amber"}`}
                  >
                    {g.label}
                  </Link>
                  <ul className="contents lg:block lg:space-y-0.5">
                    {items.map((c) => (
                      <li key={c.slug} className="shrink-0">
                        <Link
                          href={`/product-category/${c.slug}/`}
                          aria-current={activeSlug === c.slug ? "page" : undefined}
                          className={`flex items-center justify-between gap-3 rounded-full px-4 py-2 text-sm transition-colors lg:rounded-xl lg:px-3 ${
                            activeSlug === c.slug ? "bg-amber font-semibold text-ink" : "bg-white text-heading ring-1 ring-black/5 hover:text-amber lg:bg-transparent lg:ring-0 lg:hover:bg-mist"
                          }`}
                        >
                          {c.name}
                          <span className="hidden text-xs text-muted lg:inline">{c.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>
        </Reveal>

        <div className="min-w-0">
          <Suspense fallback={<div className="mb-8 h-11" />}>
            <ShopToolbar total={list.total} from={from} to={to} />
          </Suspense>

          {list.items.length ? (
            <ProductGrid products={list.items} columns={4} />
          ) : (
            <Reveal variant="zoom" className="grid place-items-center rounded-[24px] bg-white px-6 py-20 text-center ring-1 ring-black/5">
              <PackageSearch className="size-14 animate-float text-amber" />
              <p className="mt-4 text-lg font-medium text-heading">No products were found matching your selection.</p>
              <Link href="/shop/" className="btn-amber mt-6 text-sm">Browse all products</Link>
            </Reveal>
          )}

          {list.pages > 1 && (
            <Reveal as="span" variant="fade" className="block"><nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
              {list.page > 1 && (
                <Link href={pageHref(list.page - 1)} rel="prev" aria-label="Previous page" className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-black/5 hover:bg-amber">
                  <ChevronLeft className="size-5" />
                </Link>
              )}
              {Array.from({ length: list.pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === list.page ? "page" : undefined}
                  className={`grid size-11 place-items-center rounded-full text-sm font-semibold transition-colors ${
                    n === list.page ? "bg-ink text-amber" : "bg-white ring-1 ring-black/5 hover:bg-amber"
                  }`}
                >
                  {n}
                </Link>
              ))}
              {list.page < list.pages && (
                <Link href={pageHref(list.page + 1)} rel="next" aria-label="Next page" className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-black/5 hover:bg-amber">
                  <ChevronRight className="size-5" />
                </Link>
              )}
            </nav></Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
