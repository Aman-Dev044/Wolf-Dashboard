import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { AnimatedImage } from "./AnimatedImage";
import { Reveal, SplitWords, Stagger, StaggerItem } from "./motion";
import { MouseParallax, ScrollLayer } from "./parallax";
import { breadcrumbLd } from "@/lib/seo";

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, dark = true }: { items: Crumb[]; dark?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb">
        <Stagger as="ol" gap={0.06} className={`flex flex-wrap items-center gap-1.5 text-sm ${dark ? "text-slate" : "text-muted"}`}>
          {all.map((c, i) => (
            <StaggerItem as="li" variant="left" key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-amber">
                  {c.name}
                </Link>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </nav>
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs: Crumb[];
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Depth, back to front: photo (slowest) → grid → glow orbs → copy, which drifts and fades last. */}
      {image && (
        <>
          <ScrollLayer speed={0.45} scaleTo={1.12} className="absolute inset-0">
            <AnimatedImage src={image} alt="" priority sizes="100vw" className="object-cover opacity-30" wipe="fade" kenBurns hoverZoom={false} />
          </ScrollLayer>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </>
      )}
      <ScrollLayer speed={0.3} className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0" />
      </ScrollLayer>
      <ScrollLayer speed={0.55} className="pointer-events-none absolute -top-24 right-0">
        <MouseParallax strength={70}>
          <div className="size-96 animate-glow rounded-full bg-amber/20 blur-[110px]" />
        </MouseParallax>
      </ScrollLayer>
      <ScrollLayer speed={0.15} className="pointer-events-none absolute -bottom-32 -left-24">
        <MouseParallax strength={-50}>
          <div className="size-80 animate-glow rounded-full bg-coral/10 blur-[110px] [animation-delay:-4s]" />
        </MouseParallax>
      </ScrollLayer>
      <ScrollLayer speed={0.2} fade={720} className="container-wolf relative py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={crumbs} />
        {eyebrow && (
          <Reveal variant="left">
            <p className="eyebrow mt-8">{eyebrow}</p>
          </Reveal>
        )}
        <h1 className={`${eyebrow ? "mt-4" : "mt-8"} text-display font-bold`}>
          <SplitWords text={title} />
        </h1>
        {text && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg leading-[32.5px] text-white/70 sm:text-xl">{text}</p>
          </Reveal>
        )}
        {children}
      </ScrollLayer>
    </section>
  );
}
