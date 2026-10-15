import type { Metadata } from "next";
import type { Product, Site } from "./types";
import { stripHtml } from "./format";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001").replace(/\/$/, "");
export const SITE_NAME = "Wolf";
export const DEFAULT_DESCRIPTION =
  "Wolf – Gippsland’s award-winning Telstra Partner since 1991. The true one stop shop for mobile phones, accessories, smart watches, mobile internet and business telecommunications in Traralgon, Warragul and Torquay.";

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** Builds consistent per-page metadata (canonical, Open Graph, Twitter). */
export function pageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = "/uploads/2026/07/hero-banner-bg.jpg",
  type = "website",
  noindex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type, locale: "en_AU", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function organizationLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: site.brand.name,
    legalName: site.brand.legalName,
    url: SITE_URL,
    logo: abs(site.brand.logoDark),
    foundingDate: String(site.brand.foundingYear),
    founder: { "@type": "Person", name: site.brand.founder },
    description: site.brand.footerAbout,
    sameAs: Object.values(site.social).filter(Boolean),
    subOrganization: site.stores.map((s) => storeLd(s, site)),
  };
}

export function storeLd(s: Site["stores"][number], site: Site) {
  return {
    "@type": "ElectronicsStore",
    "@id": `${SITE_URL}/contact-us/#${s.slug}`,
    name: s.name,
    image: abs(site.hero.image),
    telephone: s.phone,
    email: s.email,
    url: `${SITE_URL}/contact-us/`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.street,
      addressLocality: s.city,
      addressRegion: s.region,
      postalCode: s.postcode,
      addressCountry: s.country,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "17:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:30", closes: "13:30" },
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productLd(p: Product) {
  const url = `${SITE_URL}/product/${p.slug}/`;
  const availability = p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const description = stripHtml(p.description || p.shortDescription) || `Buy ${p.name} from Wolf, your local Telstra Partner.`;
  const offers =
    p.variations.length > 1
      ? {
          "@type": "AggregateOffer",
          priceCurrency: p.currency,
          lowPrice: p.priceMin,
          highPrice: p.priceMax,
          offerCount: p.variations.length,
          availability,
          url,
        }
      : { "@type": "Offer", priceCurrency: p.currency, price: p.price, availability, url, itemCondition: "https://schema.org/NewCondition" };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku || p.slug,
    image: p.images.map((i) => abs(i.src)),
    description,
    url,
    offers: { ...offers, seller: { "@id": `${SITE_URL}/#organization` } },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd(faq: Site["faq"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
