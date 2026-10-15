import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Catalog } from "@/components/Catalog";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | undefined>>;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SP }): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const c = await getCategory(slug);
  if (!c) return { title: "Category not found", robots: { index: false } };
  return pageMeta({
    title: `${c.name} – Buy Online`,
    description:
      c.description ||
      `Shop ${c.name} at Wolf – ${c.count} product${c.count === 1 ? "" : "s"} available. Gippsland’s award-winning Telstra Partner with stores in Traralgon, Warragul and Torquay.`,
    path: `/product-category/${c.slug}/`,
    image: c.image || undefined,
    noindex: Boolean(sp.q || sp.sort || sp.min || sp.max || (sp.page && sp.page !== "1")),
  });
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const [category, categories, list] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProducts({ category: slug, q: sp.q, sort: sp.sort, min: sp.min, max: sp.max, page: sp.page, limit: 12 }),
  ]);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow={category.group === "mobile-phones" ? "Mobile Phones" : category.group === "accessories" ? "Accessories" : "Shop"}
        title={category.name}
        text={`${category.count} product${category.count === 1 ? "" : "s"} in ${category.name}`}
        crumbs={[
          { name: "Shop", path: "/shop/" },
          { name: category.name, path: `/product-category/${category.slug}/` },
        ]}
      />
      <Catalog list={list} categories={categories} activeSlug={slug} basePath={`/product-category/${slug}/`} searchParams={sp} />
    </>
  );
}
