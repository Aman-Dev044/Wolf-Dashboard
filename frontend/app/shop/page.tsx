import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Catalog } from "@/components/Catalog";

type SP = Promise<Record<string, string | undefined>>;

const GROUP_LABEL: Record<string, string> = { "mobile-phones": "Mobile Phones", accessories: "Accessories" };

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const group = sp.group && GROUP_LABEL[sp.group];
  const filtered = Boolean(sp.q || sp.sort || sp.min || sp.max || (sp.page && sp.page !== "1"));
  return pageMeta({
    title: sp.q ? `Search results for “${sp.q}”` : group ? `${group} – Shop Online` : "Shop – Mobile Phones, Smart Watches & Accessories",
    description:
      "Shop the latest iPhone, Samsung Galaxy and Google Pixel phones, smart watches, Bluetooth headphones & speakers, Google Home devices and mobile internet from Wolf, your local Telstra Partner.",
    path: group ? `/shop/?group=${sp.group}` : "/shop/",
    // Search/sort/filter permutations shouldn't compete with the main shop page in search results.
    noindex: filtered,
  });
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const categories = await getCategories();
  const groupSlugs = sp.group ? categories.filter((c) => c.group === sp.group).map((c) => c.slug).join(",") : undefined;
  const list = await getProducts({ q: sp.q, sort: sp.sort, min: sp.min, max: sp.max, page: sp.page, category: groupSlugs, limit: 12 });
  const groupName = sp.group && GROUP_LABEL[sp.group];

  return (
    <>
      <PageHero
        title={sp.q ? `Search: ${sp.q}` : groupName || "Shop"}
        text="Your one stop shop for the latest phones, accessories and technology."
        crumbs={groupName ? [{ name: "Shop", path: "/shop/" }, { name: groupName, path: `/shop/?group=${sp.group}` }] : [{ name: "Shop", path: "/shop/" }]}
      />
      <Catalog list={list} categories={categories} activeGroup={sp.group} basePath="/shop/" searchParams={sp} />
    </>
  );
}
