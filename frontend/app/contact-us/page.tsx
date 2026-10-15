import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/api";
import { pageMeta, storeLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Contact Us – Traralgon, Warragul & Torquay Stores",
  description:
    "Get in touch with Wolf. Visit our Telstra Partner stores in Traralgon (03 5174 9448), Warragul (03 5622 3777) and Torquay (03 5264 5888). Open Mon–Fri 8.30am–5.30pm, Sat 8.30am–1.30pm.",
  path: "/contact-us/",
});

export default async function ContactPage() {
  const site = await getSite();
  const main = site.stores[0];

  return (
    <>
      {site.stores.map((s) => (
        <JsonLd key={s.slug} data={{ "@context": "https://schema.org", ...storeLd(s, site) }} />
      ))}
      <PageHero title="Get in Touch" text="We're here to help and answer any questions you might have." crumbs={[{ name: "Contact Us", path: "/contact-us/" }]} />

      <section className="bg-mist py-16 lg:py-24">
        <div className="container-wolf grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal variant="left" className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-black/5 sm:p-10">
            <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
              Send us a <span className="text-gradient">message</span>
            </h2>
            <p className="mt-2 mb-8 text-muted">Fill in the form and the right store will get back to you.</p>
            <ContactForm stores={site.contactStores} />
          </Reveal>
          <Reveal variant="right" className="min-h-[380px] overflow-hidden rounded-[28px] ring-1 ring-black/5">
            <iframe
              title={`${main.name} ${main.address}`}
              src={main.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-[380px] grayscale-[40%] transition-all duration-700 hover:grayscale-0"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24" aria-labelledby="offices">
        <div className="container-wolf">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <h2 id="offices" className="text-section font-medium tracking-[0.12px] text-navy">
              <SplitWords text="Our Offices" />
            </h2>
            <Reveal variant="right" className="rounded-[24px] bg-ink p-7 text-white lg:min-w-[380px]">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Clock className="size-5 text-amber" /> Trading Hours
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                {site.tradingHours.map((t) => (
                  <div key={t.days} className="flex justify-between gap-6 border-b border-white/10 pb-2">
                    <dt className="text-slate">{t.days}</dt>
                    <dd className={t.hours === "Closed" ? "text-coral" : "font-medium"}>{t.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-slate">
                Public Holidays: Please check our{" "}
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">
                  facebook page
                </a>
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {site.stores.map((s) => (
              <StaggerItem key={s.slug}>
                <article id={s.slug} className="group h-full scroll-mt-28 overflow-hidden rounded-[24px] bg-mist ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-2xl">
                  <div className="space-y-3 p-6">
                    <h3 className="text-xl font-semibold text-heading">{s.name}</h3>
                    <p className="flex gap-3 text-muted">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-amber" /> {s.address}
                    </p>
                    <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex gap-3 text-muted hover:text-amber">
                      <Phone className="size-5 shrink-0 text-amber" /> {s.phone}
                    </a>
                    <a href={`mailto:${s.email}`} className="flex gap-3 break-all text-muted hover:text-amber">
                      <Mail className="size-5 shrink-0 text-amber" /> {s.email}
                    </a>
                  </div>
                  <iframe title={`${s.name} ${s.address}`} src={s.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-60 w-full border-0" />
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
