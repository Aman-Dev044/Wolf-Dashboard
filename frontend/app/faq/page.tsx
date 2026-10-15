import Link from "next/link";
import { getSite } from "@/lib/api";
import { faqLd, pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Stagger, StaggerItem } from "@/components/motion";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "FAQ – Stores, Trading Hours, Pickup & Delivery",
  description: "Answers to common questions about Wolf stores, trading hours, in-store pickup, delivery, order tracking and Telstra business services.",
  path: "/faq/",
});

export default async function FaqPage() {
  const site = await getSite();
  return (
    <>
      <JsonLd data={faqLd(site.faq)} />
      <PageHero title="FAQ" text="Quick answers to the questions we hear most often." crumbs={[{ name: "FAQ", path: "/faq/" }]} />
      <section className="bg-mist py-12 lg:py-20">
        <div className="container-wolf max-w-3xl">
          <Stagger className="space-y-3">
            {site.faq.map((f, i) => (
              <StaggerItem key={f.q}>
                <details open={i === 0} className="group rounded-[20px] bg-white ring-1 ring-black/5 open:ring-amber/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold text-heading [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-xl transition-transform duration-300 group-open:rotate-45 group-open:bg-amber">+</span>
                  </summary>
                  <p className="px-6 pb-6 leading-7 text-muted">{f.a}</p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-10 text-center text-muted">
            Still have a question?{" "}
            <Link href="/contact-us/" className="font-semibold text-heading underline decoration-amber decoration-2 underline-offset-4 hover:text-amber">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
