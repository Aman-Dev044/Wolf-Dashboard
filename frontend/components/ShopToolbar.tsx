"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

const SORTS = [
  { value: "", label: "Default sorting" },
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
  { value: "name-asc", label: "Sort by name: A–Z" },
];

/** Search, sort and price filters – all state lives in the URL so results are shareable and crawlable. */
export function ShopToolbar({ total, from, to }: { total: number; from: number; to: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setMin(params.get("min") ?? "");
    setMax(params.get("max") ?? "");
  }, [params]);

  const push = (patch: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    sp.delete("page");
    start(() => router.push(`${pathname}${sp.size ? `?${sp}` : ""}`, { scroll: false }));
  };

  const hasFilters = params.get("q") || params.get("min") || params.get("max");

  return (
    <div className={`mb-8 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          {total ? `Showing ${from}–${to} of ${total} results` : "No products found"}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              push({ q: q.trim() });
            }}
            className="relative flex-1 sm:flex-none"
          >
            <label htmlFor="shop-q" className="sr-only">Search products</label>
            <input id="shop-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field rounded-full py-2.5 pr-11 sm:w-64" />
            <button type="submit" aria-label="Search" className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-amber text-ink">
              <Search className="size-4" />
            </button>
          </form>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium hover:border-amber">
            <SlidersHorizontal className="size-4" /> Price
          </button>
          <label htmlFor="shop-sort" className="sr-only">Sort products</label>
          <select id="shop-sort" value={params.get("sort") ?? ""} onChange={(e) => push({ sort: e.target.value })} className="field w-auto rounded-full py-2.5 pr-10">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            push({ min, max });
          }}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5"
        >
          <label className="text-sm text-muted">
            Min price ($)
            <input type="number" min={0} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className="field mt-1 w-32 py-2" />
          </label>
          <label className="text-sm text-muted">
            Max price ($)
            <input type="number" min={0} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className="field mt-1 w-32 py-2" />
          </label>
          <button type="submit" className="btn-dark py-3">Apply</button>
        </form>
      )}

      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {params.get("q") && <Chip label={`“${params.get("q")}”`} onClear={() => push({ q: "" })} />}
          {params.get("min") && <Chip label={`From $${params.get("min")}`} onClear={() => push({ min: "" })} />}
          {params.get("max") && <Chip label={`Up to $${params.get("max")}`} onClear={() => push({ max: "" })} />}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs text-white hover:bg-amber hover:text-ink">
      {label} <X className="size-3.5" />
    </button>
  );
}
