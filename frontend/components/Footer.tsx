import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { Reveal, SplitWords } from "./motion";
import { BackdropWord, Magnetic, MouseParallax, Parallax } from "./parallax";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "./icons";
import { footerLinks } from "@/lib/nav";
import type { Site } from "@/lib/types";

export function Footer({ site }: { site: Site }) {
  const socials = [
    { label: "X-twitter", href: site.social.x, Icon: XIcon },
    { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
    { label: "Linkedin", href: site.social.linkedin, Icon: LinkedinIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <Parallax speed={-0.4} className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
        <MouseParallax strength={90}>
          <div className="h-80 w-[60rem] rounded-full bg-amber/10 blur-3xl" />
        </MouseParallax>
      </Parallax>
      {/* Oversized brand word that slides across behind the link columns. */}
      <BackdropWord text="Wolf · Wolf · Wolf" className="bottom-16" travel={-500} />

      {/* Newsletter – full-width amber band */}
      <section className="relative bg-amber text-ink">
        <div className="container-wolf py-16 text-center sm:py-20">
          <h2 className="text-4xl font-medium tracking-tight uppercase sm:text-5xl lg:text-[64px] lg:leading-none">
            <SplitWords text={site.newsletter.title} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink/75 sm:text-lg">{site.newsletter.text}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <NewsletterForm />
          </Reveal>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="container-wolf relative pt-6">
        <Reveal variant="fade" className="flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold sm:text-[28px]">{site.questions.title}</h3>
            <p className="mt-2 max-w-2xl text-slate">{site.questions.text}</p>
          </div>
          <Magnetic className="shrink-0">
            <Link href="/contact-us/" className="btn-amber">
              Contact Us <ArrowUpRight className="size-5" />
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* Columns */}
      <div className="container-wolf relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_2fr]">
        <Reveal variant="up">
          <Link href="/" aria-label="Wolf – home">
            <Image src={site.brand.logo} alt="Wolf Telstra Partner" width={190} height={40} className="h-9 w-auto transition-[scale] duration-500 hover:scale-105" />
          </Link>
          <p className="mt-6 max-w-sm leading-7 text-slate">{site.brand.footerAbout}</p>
          <ul className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href || "#"}
                  aria-label={label}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="grid size-10 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-amber hover:text-ink"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal variant="up" delay={0.1}>
        <nav aria-label="Quick Links">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-5 space-y-3">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group inline-flex items-center text-slate transition-colors hover:text-amber">
                  <span className="h-px w-0 bg-amber transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </Reveal>

        <Reveal variant="up" delay={0.2}>
          <h4 className="text-lg font-semibold text-white">Contact Us</h4>
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {site.stores.map((s) => (
              <li key={s.slug} className="space-y-3 text-sm">
                <p className="flex gap-2.5 text-white">
                  <MapPin className="mt-0.5 size-4 shrink-0 animate-float text-amber" />
                  <span>
                    <strong className="block font-semibold">{s.name}</strong>
                    <span className="text-slate">{s.address}</span>
                  </span>
                </p>
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-slate hover:text-amber">
                  <Phone className="size-4 shrink-0 text-amber" /> {s.phone}
                </a>
                <a href={`mailto:${s.email}`} className="flex items-center gap-2.5 break-all text-slate hover:text-amber">
                  <Mail className="size-4 shrink-0 text-amber" /> {s.email}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wolf flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate sm:flex-row">
          <p>{site.brand.copyright}</p>
          <p className="flex gap-5">
            <Link href="/faq/" className="hover:text-amber">FAQ</Link>
            <Link href="/tracking/" className="hover:text-amber">Tracking Package</Link>
            <Link href="/contact-us/" className="hover:text-amber">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
