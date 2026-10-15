import "server-only";
import fallbackSite from "./site-fallback.json";
import type { Category, Product, ProductList, Site } from "./types";

const API = process.env.API_URL || "http://localhost:4001/api";
const REVALIDATE = 60;

async function get<T>(path: string, tags: string[] = []): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: REVALIDATE, tags } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Backend unreachable (e.g. during a build without the API running) – callers fall back gracefully.
    return null;
  }
}

export async function getSite(): Promise<Site> {
  const site = await get<Site>("/site", ["site"]);
  return site && Object.keys(site).length ? site : (fallbackSite as Site);
}

export async function getCategories(): Promise<Category[]> {
  return (await get<Category[]>("/categories", ["categories"])) ?? [];
}

export async function getCategory(slug: string): Promise<Category | null> {
  return get<Category>(`/categories/${encodeURIComponent(slug)}`, ["categories"]);
}

export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: string;
  min?: string | number;
  max?: string | number;
  page?: string | number;
  limit?: number;
  featured?: boolean;
  exclude?: string;
};

export async function getProducts(query: ProductQuery = {}): Promise<ProductList> {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === "" || v === false) continue;
    sp.set(k, v === true ? "1" : String(v));
  }
  return (await get<ProductList>(`/products?${sp}`, ["products"])) ?? { items: [], total: 0, page: 1, pages: 1, limit: 12 };
}

export async function getProduct(slug: string) {
  return get<{ product: Product; related: Product[]; categories: { name: string; slug: string; group: string }[] }>(
    `/products/${encodeURIComponent(slug)}`,
    ["products"]
  );
}
