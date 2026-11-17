import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Store, Trophy } from "lucide-react";
import { getSite } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { AnimatedImage } from "@/components/AnimatedImage";
import { Reveal, SplitWords, Stagger, StaggerItem, Tilt } from "@/components/motion";
import { BackdropWord, Magnetic, Parallax } from "@/components/parallax";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "About Us – Gippsland’s Award-Winning Telstra Partner",
  description:
    "Founded in 1989 by Wolf Haefele, Wolf is Gippsland’s first Telstra dealer and one of its most awarded Telstra Partners. Meet our team, see our awards and learn our history.",
  path: "/about-us/",
  image: "/uploads/2026/07/about-banner.jpg",
});

export default async function AboutPage() {
  const site = await getSite();
  const { about, history } = site;

  return (
    <>
      <PageHero eyebrow={site.brand.tagline} title={about.title} crumbs={[{ name: "About Us", path: "/about-us/" }]} image={about.banner}>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-[32.5px] text-white/70 sm:text-xl">{about.intro}</p>
          <p className="mt-4 max-w-2xl text-lg leading-[32.5px] text-white/70 sm:text-xl">{about.origin}</p>
        </Reveal>
        <Reveal delay={0.35} className="mt-10">
          <Magnetic>
            <Link href="/contact-us/" className="btn-amber">
              Contact Us <ArrowRight className="size-5" />
            </Link>
          </Magnetic>
        </Reveal>
      </PageHero>

      {/* What we do */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28" aria-labelledby="what-we-do">
        <BackdropWord text="What we do" className="top-8" travel={-360} dark={false} />
        <div className="container-wolf relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left">
            <Tilt className="relative mx-auto max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] shadow-2xl">
                <AnimatedImage src={about.whatWeDoImage} alt="Wolf team helping customers" sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" wipe="up" parallax />
              </div>
            </Tilt>
          </Reveal>
          <div>
            <h2 id="what-we-do" className="text-section font-medium tracking-[0.12px] text-navy">
              <SplitWords text="What we do" />
            </h2>
            <Stagger as="ul" className="mt-10 space-y-3">
              {site.services.map((s, i) => (
                <StaggerItem as="li" key={s} variant="right">
                  <div className="group flex items-center gap-5 rounded-2xl border border-black/5 bg-mist px-5 py-4 transition-all duration-300 hover:border-amber hover:bg-white hover:shadow-lg">
                    <span className="text-sm font-semibold text-amber tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-base font-medium text-heading sm:text-lg">{s}</span>
                    <CheckCircle2 className="size-5 text-amber opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-mist py-20 lg:py-28" aria-labelledby="team-title">
        <div className="container-wolf">
          <h2 id="team-title" className="text-center text-section font-medium tracking-[0.12px] text-navy">
            <SplitWords text="Meet Our" /> <SplitWords text="Team" className="text-gradient" delay={0.1} />
          </h2>
          <div className="mt-14 space-y-14">
            {site.team.map((g) => (
              <div key={g.group}>
                <Reveal variant="fade">
                  <h3 className="mb-6 flex items-center gap-3 text-lg font-semibold text-heading sm:text-xl">
                    <span className="h-px w-8 bg-amber" /> {g.group}
                  </h3>
                </Reveal>
                <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {g.members.map((m, i) => (
                    <StaggerItem key={m.name}>
                      <Parallax speed={i % 2 ? 0.14 : 0} desktopOnly className="h-full">
                        <article className="group overflow-hidden rounded-[24px] bg-white ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                          <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                            <AnimatedImage src={m.image} alt={`${m.name}, ${m.role}`} sizes="(max-width: 640px) 100vw, 25vw" className="object-cover object-top" wipe="up" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <span className="absolute top-4 left-4 z-10 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-ink transition-transform duration-500 group-hover:scale-110">Since {m.joined}</span>
                          </div>
                          <div className="p-6">
                            <h4 className="text-xl font-semibold text-heading">{m.name}</h4>
                            <p className="mt-1 text-sm text-muted">{m.role}</p>
                            <p className="mt-1 text-sm text-muted">Joined the team in {m.joined}</p>
                            <a href={`mailto:${m.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-amber">
                              <Mail className="size-4 text-amber" /> {m.email}
                            </a>
                          </div>
                        </article>
                      </Parallax>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="awards-title">
        <Parallax speed={-0.5} className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2">
          <div className="h-80 w-[50rem] rounded-full bg-amber/15 blur-3xl" />
        </Parallax>
        <BackdropWord text="Award winning" className="top-6" travel={400} />
        <div className="container-wolf relative">
          <h2 id="awards-title" className="text-center text-section font-medium tracking-[0.12px]">
            <SplitWords text="Awards" />
          </h2>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.awards.map((a, i) => (
              <StaggerItem key={i} variant="zoom">
                <article className="glass group relative h-full overflow-hidden rounded-[24px] p-7 transition-colors duration-500 hover:border-amber/50">
                  <div className="absolute -top-10 -right-10 size-32 rounded-full bg-amber/0 blur-2xl transition-colors duration-500 group-hover:bg-amber/30" />
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-amber text-ink transition-transform duration-500 group-hover:rotate-12">
                      <Trophy className="size-7" />
                    </span>
                    <span className="text-3xl font-bold text-white/90">{a.year}</span>
                  </div>
                  <p className="relative mt-6 leading-7 text-slate">{a.title}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* History */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="history-title">
        <Parallax speed={-0.4} className="absolute inset-x-0 -inset-y-28">
          <video className="size-full object-cover opacity-20" autoPlay muted loop playsInline preload="none" aria-hidden poster={history.image}>
            <source src={history.video} type="video/mp4" />
          </video>
        </Parallax>
        <BackdropWord text={`Since ${site.brand.foundingYear}`} className="bottom-6" travel={-380} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <div className="container-wolf relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left" className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[28px] ring-1 ring-white/10">
            <AnimatedImage src={history.image} alt="Wolf history" sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" wipe="left" parallax />
          </Reveal>
          <div>
            <h2 id="history-title" className="text-section font-medium tracking-[0.12px] capitalize">
              <SplitWords text="Wolf:" /> <SplitWords text="History" className="text-gradient" delay={0.1} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-[32.5px] tracking-[0.32px] text-slate sm:text-xl">{history.text.join(" ")}</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10">
              <Link href="/shop/" className="btn-amber px-6 py-2.5 text-sm font-medium">
                <Store className="size-4" /> VISIT THE STORE
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
