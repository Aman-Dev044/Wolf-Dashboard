import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, ShieldCheck, Store, Truck } from "lucide-react";
import { getProduct, getProducts, getSite } from "@/lib/api";
import { priceLabel, stripHtml } from "@/lib/format";
import { pageMeta, productLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/PageHero";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCart } from "@/components/AddToCart";
import { ProductGrid } from "@/components/ProductGrid";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, SplitWords } from "@/components/motion";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { items } = await getProducts({ limit: 100 });
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product not found", robots: { index: false } };
  const p = data.product;
  const cat = data.categories[0]?.name;
  const desc =
    stripHtml(p.shortDescription || p.description).slice(0, 155) ||
    `Buy ${p.name}${cat ? ` (${cat})` : ""} from ${priceLabel(p)} at Wolf – Gippsland’s award-winning Telstra Partner. Pick up in Traralgon, Warragul or Torquay.`;
  return pageMeta({ title: p.name, description: desc, path: `/product/${p.slug}/`, image: p.images[0]?.src });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [data, site] = await Promise.all([getProduct(slug), getSite()]);
  if (!data) notFound();
  const { product: p, related, categories } = data;
  const cat = categories[0];
  const facts = [
    ...p.attributes.map((a) => ({ label: a.name, value: a.options.join(", ") })),
    ...(cat ? [{ label: "Category", value: categories.map((c) => c.name).join(", ") }] : []),
    ...(p.sku ? [{ label: "SKU", value: p.sku }] : []),
  ];

  return (
    <>
      <JsonLd data={productLd(p)} />
      <div className="bg-mist">
        <div className="container-wolf pt-8">
          <Breadcrumbs
            dark={false}
            items={[
              { name: "Shop", path: "/shop/" },
              ...(cat ? [{ name: cat.name, path: `/product-category/${cat.slug}/` }] : []),
              { name: p.name, path: `/product/${p.slug}/` },
            ]}
          />
        </div>

        <section className="container-wolf grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
          <Reveal variant="left">
            <ProductGallery images={p.images} name={p.name} />
          </Reveal>

          <Reveal variant="right">
            {cat && (
              <Link href={`/product-category/${cat.slug}/`} className="chip border-ink/10 bg-ink/5 text-muted hover:text-amber">
                {cat.name}
              </Link>
            )}
            <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-navy sm:text-5xl">{p.name}</h1>
            <div className="mt-6">
              <AddToCart product={p} />
            </div>

            {p.shortDescription && <div className="prose-wolf mt-8" dangerouslySetInnerHTML={{ __html: p.shortDescription }} />}

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Store, title: "Pick up in store", text: site.stores.map((s) => s.city).join(", ") },
                { Icon: Truck, title: "Home delivery", text: "Choose delivery at checkout" },
                { Icon: ShieldCheck, title: "Telstra Partner", text: "Trusted since 1991" },
                { Icon: Clock, title: "Expert advice", text: "Mon–Fri 8.30am–5.30pm" },
              ].map(({ Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
                  <Icon className="mt-0.5 size-5 shrink-0 text-amber" />
                  <span>
                    <span className="block text-sm font-semibold text-heading">{title}</span>
                    <span className="block text-xs text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="container-wolf pb-16">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-[24px] bg-white p-7 ring-1 ring-black/5 sm:p-10">
              <h2 className="text-2xl font-semibold text-heading">Description</h2>
              {p.description ? (
                <div className="prose-wolf mt-4" dangerouslySetInnerHTML={{ __html: p.description }} />
              ) : (
                <p className="prose-wolf mt-4">
                  Get the {p.name} from Wolf, your local Telstra Partner. Visit one of our stores in {site.stores.map((s) => s.city).join(", ")} for
                  expert advice, setup help and plan options, or order online for pick up or delivery.
                </p>
              )}
            </Reveal>
            <Reveal delay={0.1} className="rounded-[24px] bg-ink p-7 text-white sm:p-10">
              <h2 className="text-2xl font-semibold">Additional information</h2>
              <dl className="mt-5 divide-y divide-white/10">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-slate">{f.label}</dt>
                    <dd className="text-right font-medium">{f.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-slate">Availability</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    <MapPin className="size-4 text-amber" /> In store &amp; online
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="bg-ink py-20 text-white" aria-labelledby="related-title">
          <div className="container-wolf">
            <h2 id="related-title" className="mb-12 text-section font-medium tracking-[0.12px]">
              <SplitWords text="Related" /> <SplitWords text="products" className="text-gradient" delay={0.1} />
            </h2>
            <ProductGrid products={related.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}
    </>
  );
}
