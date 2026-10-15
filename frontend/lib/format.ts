import type { Product } from "./types";

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });

export function money(n: number) {
  return aud.format(n);
}

export function priceLabel(p: Pick<Product, "priceMin" | "priceMax" | "price">) {
  const min = p.priceMin ?? p.price;
  const max = p.priceMax ?? p.price;
  return min === max ? money(min) : `${money(min)} – ${money(max)}`;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function variationLabel(attrs: Record<string, string>) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}
