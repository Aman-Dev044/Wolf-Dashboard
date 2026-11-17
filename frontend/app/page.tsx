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
import { BackdropWord, Magnetic, MouseParallax, Parallax, ScrollLayer, ScrollLine, ScrollText, ScrollZoom } from "@/components/parallax";

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
        {/* Depth, back to front: grid → glow orbs (also follow the pointer) → copy → picture & badges. */}
        <ScrollLayer speed={0.35} className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0" />
        </ScrollLayer>
        <ScrollLayer speed={0.55} className="pointer-events-none absolute -top-32 -left-24">
          <MouseParallax strength={80}>
            <div className="size-[28rem] animate-glow rounded-full bg-amber/25 blur-[120px]" />
          </MouseParallax>
        </ScrollLayer>
        <ScrollLayer speed={0.2} className="pointer-events-none absolute -right-24 bottom-0">
          <MouseParallax strength={-60}>
            <div className="size-[22rem] animate-glow rounded-full bg-coral/15 blur-[120px] [animation-delay:-4s]" />
          </MouseParallax>
        </ScrollLayer>

        <div className="container-wolf relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <ScrollLayer speed={0.22} fade={800}>
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
              <Magnetic>
                <Link href="/shop/" className="btn-amber">
                  {hero.cta.label} <ArrowRight className="size-5" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/about-us/" className="btn-ghost">
                  Our story
                </Link>
              </Magnetic>
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
          </ScrollLayer>

          <HeroVisual image={hero.image} />
        </div>

        {/* Quick links */}
        <Parallax speed={0.15} className="container-wolf relative pb-16 lg:pb-24">
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
        </Parallax>
      </section>

      {/* ───────────── TRENDING ───────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="trending-title">
        <Parallax speed={-0.4} className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2">
          <div className="h-72 w-[50rem] rounded-full bg-amber/10 blur-3xl" />
        </Parallax>
        <BackdropWord text="Trending now" className="top-6 lg:top-10" travel={-420} />
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
            <Parallax speed={-0.25} className="absolute -inset-4 -z-0">
              <div className="size-full rounded-[32px] bg-gradient-to-br from-amber/30 via-transparent to-coral/20 blur-2xl" />
            </Parallax>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <AnimatedImage src={about.image} alt="Inside a Wolf store" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" wipe="up" parallax />
            </div>
            <Parallax speed={0.45} className="absolute -right-3 -bottom-6 sm:right-6">
              <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
                <Award className="size-8 text-amber" />
                <div>
                  <p className="text-sm font-semibold">Most awarded</p>
                  <p className="text-xs text-slate">Telstra Partner in Gippsland</p>
                </div>
              </div>
            </Parallax>
          </Reveal>
          <div>
            <h2 id="about-title" className="text-section font-medium tracking-[0.12px] text-white">
              <SplitWords text={about.title} />
            </h2>
            <ScrollText text={about.intro} className="mt-6 text-lg leading-[32.5px] text-white sm:text-xl" />
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
            <Parallax speed={0.18} className="absolute inset-x-4 bottom-4">
              <div className="rounded-2xl bg-ink/70 p-5 text-white backdrop-blur-md">
                <p className="text-sm text-slate">Visit us in</p>
                <p className="mt-1 font-semibold">{site.stores.map((s) => s.city).join(" · ")}</p>
              </div>
            </Parallax>
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
        {/* The video sits on an oversized layer so it can lag behind the scroll without showing an edge. */}
        <Parallax speed={-0.4} className="absolute inset-x-0 -inset-y-28">
          <video className="size-full object-cover opacity-25" autoPlay muted loop playsInline preload="none" aria-hidden poster={history.image}>
            <source src={history.video} type="video/mp4" />
          </video>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <BackdropWord text={`Since ${site.brand.foundingYear}`} className="bottom-6" travel={380} />
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
            <Stagger as="ul" className="relative mt-10 grid gap-6 pl-8 sm:grid-cols-2 sm:pl-0">
              <ScrollLine className="absolute inset-y-0 left-0 w-px sm:hidden" />
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
            <Parallax speed={0.5} className="absolute top-8 -left-2 sm:left-4 lg:-left-6">
              <div className="animate-float rounded-2xl bg-amber px-5 py-4 text-ink shadow-xl">
                <p className="text-3xl font-bold">35+</p>
                <p className="text-xs font-medium">years in Gippsland</p>
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      {/* Full-bleed band; the copy still lines up with the site's content column. */}
      <section className="overflow-hidden bg-ink pb-20 lg:pb-28">
        <ScrollZoom from={0.94} className="relative overflow-hidden">
          <AnimatedImage src={cta.image} alt="" sizes="100vw" className="object-cover object-right" wipe="right" kenBurns hoverZoom={false} blur={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-mist via-mist/90 to-mist/10" />
          <div className="container-wolf relative py-14 sm:py-16 lg:py-20">
            <div className="max-w-xl">
              <ScrollText text={cta.text} className="text-lg leading-[1.6] font-medium text-ink sm:text-xl lg:text-[22px]" />
              <Link href="/contact-us/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-base font-medium text-amber transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber hover:text-ink">
                {cta.label} <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </ScrollZoom>
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
          <Parallax speed={-0.5} className="pointer-events-none absolute -right-40 -bottom-40">
            <div className="size-[30rem] rounded-full bg-amber/10 blur-3xl" />
          </Parallax>
          <div className="container-wolf relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Reveal variant="fade">
                <p className="text-2xl leading-[1.1] font-normal tracking-[-1px] text-white/50 sm:text-[30px]">{testimonial.eyebrow}</p>
              </Reveal>
              <h2 id="testimonial-title" className="mt-5 text-quote leading-[1.1] font-normal tracking-[-2px] text-white sm:tracking-[-4px]">
                <SplitWords text={testimonial.title} />
              </h2>
            </div>
            <Parallax speed={0.12} desktopOnly>
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
            </Parallax>
          </div>
        </section>
      )}
    </>
  );
}
