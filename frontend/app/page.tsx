import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, CheckCircle2, MapPin, Quote, Star, Store } from "lucide-react";
import { getProducts, getSite } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { BrandMarquee } from "@/components/BrandMarquee";
import { TrendingTabs } from "@/components/TrendingTabs";
import { SectionHeading } from "@/components/SectionHeading";
import { HeroVisual } from "@/components/HeroVisual";
import { AnimatedImage } from "@/components/AnimatedImage";
import { Counter, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Wolf – Your One Stop Shop | Telstra Partner Gippsland",
  path: "/",
});

export default async function HomePage() {
  const site = await getSite();
  const tabs = await Promise.all(
    site.trendingTabs.map(async (t) => ({
      label: t.label,
      products: (await getProducts(t.category ? { category: t.category, limit: 5 } : { sort: "latest", limit: 5 })).items,
    }))
  );
  const { hero, about, store, history, cta, partners } = site;
  const testimonial = site.testimonials[0];

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-32 -left-24 size-[28rem] animate-glow rounded-full bg-amber/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-[22rem] animate-glow rounded-full bg-coral/15 blur-[120px] [animation-delay:-4s]" />

        <div className="container-wolf relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <Reveal variant="left">
              <p className="eyebrow">{hero.eyebrow}</p>
            </Reveal>
            <h1 className="mt-5 text-display font-bold">
              <SplitWords text="Welcome to" delay={0.1} /> <SplitWords text="WOLF" className="text-gradient" delay={0.3} />
            </h1>
            <Reveal delay={0.35}>
              <p className="mt-7 max-w-xl text-lead leading-[1.2] font-normal text-white/70">{hero.text}</p>
            </Reveal>
            <Reveal delay={0.5} className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/shop/" className="btn-amber">
                {hero.cta.label} <ArrowRight className="size-5" />
              </Link>
              <Link href="/about-us/" className="btn-ghost">
                Our story
              </Link>
            </Reveal>
            <Reveal delay={0.65} className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <Counter to={site.brand.foundingYear} className="block text-3xl font-bold text-white sm:text-4xl" />
                <span className="text-sm text-slate">Established</span>
              </div>
              <div>
                <Counter to={site.stores.length} className="block text-3xl font-bold text-white sm:text-4xl" />
                <span className="text-sm text-slate">Stores in VIC</span>
              </div>
              <div>
                <Counter to={site.awards.length} suffix="+" className="block text-3xl font-bold text-white sm:text-4xl" />
                <span className="text-sm text-slate">Telstra awards</span>
              </div>
            </Reveal>
          </div>

          <HeroVisual image={hero.image} />
        </div>

        {/* Quick links */}
        <div className="container-wolf relative pb-16 lg:pb-24">
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" gap={0.06}>
            {site.quickLinks.map((q) => (
              <StaggerItem key={q.label} variant="zoom">
                <Link
                  href={q.href}
                  className="group relative flex h-full items-center justify-between gap-2 overflow-hidden rounded-[6px] bg-white px-5 py-8 text-sm font-medium text-label uppercase transition-colors duration-500 hover:text-white lg:py-[55px]"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-amber transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                  <span className="relative">{q.label}</span>
                  <ArrowUpRight className="relative size-4 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────────── TRENDING ───────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="trending-title">
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-amber/10 blur-3xl" />
        <div className="container-wolf relative">
          <h2 id="trending-title" className="mb-10 text-center text-section font-medium tracking-[0.12px] text-white">
            <SplitWords text="Trending" />
          </h2>
          <TrendingTabs tabs={tabs} />
          <Reveal className="mt-14 text-center">
            <Link href="/shop/" className="btn-ghost">
              Browse all products <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────── ABOUT ───────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="about-title">
        <div className="container-wolf grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left" className="relative">
            <div className="absolute -inset-4 -z-0 rounded-[32px] bg-gradient-to-br from-amber/30 via-transparent to-coral/20 blur-2xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <AnimatedImage src={about.image} alt="Inside a Wolf store" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" wipe="up" parallax />
            </div>
            <div className="glass absolute -right-3 -bottom-6 flex items-center gap-3 rounded-2xl px-5 py-4 sm:right-6">
              <Award className="size-8 text-amber" />
              <div>
                <p className="text-sm font-semibold">Most awarded</p>
                <p className="text-xs text-slate">Telstra Partner in Gippsland</p>
              </div>
            </div>
          </Reveal>
          <div>
            <h2 id="about-title" className="text-section font-medium tracking-[0.12px] text-white">
              <SplitWords text={about.title} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-[32.5px] text-slate sm:text-xl">{about.intro}</p>
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-2">
              {site.services.map((s) => (
                <StaggerItem as="li" key={s} variant="right">
                  <span className="flex h-full items-start gap-3 rounded-2xl bg-white/[0.04] p-4 text-[15px] leading-6 text-white/90 ring-1 ring-white/10 transition-colors hover:ring-amber/50">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber" /> {s}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ───────────── WOLF STORE ───────────── */}
      <section className="bg-mist py-20 lg:py-28" aria-labelledby="store-title">
        <div className="container-wolf grid gap-5 lg:grid-cols-12">
          <Reveal variant="up" className="flex flex-col justify-between rounded-[28px] bg-white p-8 ring-1 ring-black/5 sm:p-12 lg:col-span-7">
            <div>
              <p className="flex items-center gap-2 text-sm tracking-[0.55px] text-muted uppercase">
                <Store className="size-4 text-amber" /> {store.eyebrow}
              </p>
              <h2 id="store-title" className="mt-5 text-store leading-[1.1] font-bold tracking-[0.12px] text-navy uppercase">
                <SplitWords text={store.title} />
              </h2>
              <p className="mt-6 max-w-xl text-base leading-6 tracking-[0.32px] text-muted">{store.text}</p>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <Link href="/shop/" className="btn-amber px-6 py-2.5 text-sm font-medium uppercase">
                <Store className="size-4" /> VISIT THE STORE
              </Link>
              <Image src={site.brand.logoDark} alt="Wolf Telstra Partner logo" width={191} height={51} className="h-10 w-auto transition-[scale,rotate] duration-500 hover:scale-110 hover:-rotate-2" />
            </div>
          </Reveal>
          <Reveal variant="zoom" delay={0.1} className="relative min-h-[420px] overflow-hidden rounded-[28px] lg:col-span-5 lg:row-span-2">
            <AnimatedImage src={store.image} alt="Customer using a smartphone" sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" wipe="left" parallax />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-ink/70 p-5 text-white backdrop-blur-md">
              <p className="text-sm text-slate">Visit us in</p>
              <p className="mt-1 font-semibold">{site.stores.map((s) => s.city).join(" · ")}</p>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-5 lg:col-span-7 lg:grid-cols-3">
            {site.stores.map((s) => (
              <StaggerItem key={s.slug} className="last:col-span-2 lg:last:col-span-1">
                <Link href={`/contact-us/#${s.slug}`} className="group flex h-full flex-col rounded-[24px] bg-ink p-6 text-white transition-transform duration-500 hover:-translate-y-1">
                  <MapPin className="size-6 text-amber transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
                  <p className="mt-4 font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-slate">{s.address}</p>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-sm text-amber">
                    {s.phone} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────────── HISTORY ───────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="history-title">
        <video className="absolute inset-0 size-full object-cover opacity-25" autoPlay muted loop playsInline preload="none" aria-hidden poster={history.image}>
          <source src={history.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <div className="container-wolf relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <h2 id="history-title" className="text-section font-medium tracking-[0.12px] capitalize">
              <SplitWords text="Wolf:" /> <SplitWords text="History" className="text-gradient" delay={0.1} />
            </h2>
            {history.text.map((t, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p className="mt-6 text-lg leading-[32.5px] tracking-[0.32px] text-slate sm:text-xl">{t}</p>
              </Reveal>
            ))}
            <Stagger as="ul" className="relative mt-10 grid gap-6 border-l border-white/15 pl-8 sm:grid-cols-2 sm:border-l-0 sm:pl-0">
              {history.milestones.map((m) => (
                <StaggerItem as="li" key={m.year} className="relative sm:border-t sm:border-white/15 sm:pt-5">
                  <span className="absolute top-1.5 -left-[37px] size-3 rounded-full bg-amber ring-4 ring-amber/20 sm:-top-1.5 sm:left-0" />
                  <p className="text-2xl font-bold text-amber">{m.year}</p>
                  <p className="mt-1 text-sm text-slate">{m.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} className="mt-10">
              <Link href="/shop/" className="btn-amber px-6 py-2.5 text-sm font-medium hover:bg-mist hover:text-ink">
                <Store className="size-4" /> VISIT THE STORE
              </Link>
            </Reveal>
          </div>
          <Reveal variant="right" className="relative order-1 lg:order-2">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <AnimatedImage src={history.image} alt="The Wolf store through the years" sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" wipe="down" parallax />
            </div>
            <div className="absolute top-8 -left-2 animate-float rounded-2xl bg-amber px-5 py-4 text-ink shadow-xl sm:left-4 lg:-left-6">
              <p className="text-3xl font-bold">35+</p>
              <p className="text-xs font-medium">years in Gippsland</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="bg-ink pb-20 lg:pb-28">
        <div className="container-wolf">
          <Reveal variant="zoom" className="relative overflow-hidden rounded-[32px]">
            <AnimatedImage src={cta.image} alt="" sizes="100vw" className="object-cover object-right" wipe="right" kenBurns hoverZoom={false} blur={false} />
            <div className="absolute inset-0 bg-gradient-to-r from-mist via-mist/90 to-mist/10" />
            <div className="relative max-w-2xl p-8 sm:p-14 lg:py-20">
              <Reveal variant="blur" delay={0.2}>
                <p className="text-cta leading-[1.5] font-medium text-ink">{cta.text}</p>
              </Reveal>
              <Link href="/contact-us/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-[25px] py-2.5 text-xl leading-8 font-medium text-amber transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber hover:text-ink">
                {cta.label} <ArrowUpRight className="size-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── PARTNERS ───────────── */}
      <section className="bg-mist py-20 lg:py-28" aria-labelledby="partners-title">
        <div className="container-wolf mb-12 text-center">
          <h2 id="partners-title" className="text-partners font-medium tracking-[0.26px] text-ink">
            <SplitWords text="PARTNERS" className="text-gradient" /> <SplitWords text="& Brands" delay={0.1} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-4 text-base leading-[1.5] font-medium tracking-[-0.31px] text-muted">{partners.text}</p>
          </Reveal>
        </div>
        <BrandMarquee logos={partners.logos} />
      </section>

      {/* ───────────── TESTIMONIAL ───────────── */}
      {testimonial && (
        <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="testimonial-title">
          <div className="pointer-events-none absolute -right-40 -bottom-40 size-[30rem] rounded-full bg-amber/10 blur-3xl" />
          <div className="container-wolf relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Reveal variant="fade">
                <p className="text-2xl leading-[1.1] font-normal tracking-[-1px] text-white/50 sm:text-[30px]">{testimonial.eyebrow}</p>
              </Reveal>
              <h2 id="testimonial-title" className="mt-5 text-quote leading-[1.1] font-normal tracking-[-2px] text-white sm:tracking-[-4px]">
                <SplitWords text={testimonial.title} />
              </h2>
            </div>
            <Reveal variant="right" className="glass relative rounded-[32px] p-8 sm:p-12">
              <Quote className="absolute -top-6 right-10 size-12 rounded-2xl bg-amber p-2.5 text-ink" aria-hidden />
              <div className="flex gap-1 text-amber" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5" fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-6 text-lg leading-[26px] tracking-[-0.3px] text-white/80">“{testimonial.quote}”</blockquote>
              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <span className="grid size-12 place-items-center rounded-full bg-amber text-lg font-bold text-ink">
                  {testimonial.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-2xl leading-none font-semibold tracking-[-0.5px]">{testimonial.name}</p>
                  <p className="mt-1.5 text-sm text-white/50">{testimonial.role}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
