import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, { items }] = await Promise.all([getCategories(), getProducts({ limit: 100 })]);
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about-us/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/tracking/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...pages,
    ...categories.map((c) => ({
      url: `${SITE_URL}/product-category/${c.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...items.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}/`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 3).map((i) => `${SITE_URL}${i.src}`),
    })),
  ];
}
