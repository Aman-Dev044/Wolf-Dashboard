import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-ink px-4 text-center text-white">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute size-96 animate-glow rounded-full bg-amber/20 blur-[120px]" />
      <Reveal variant="zoom" className="relative">
        <p className="animate-float text-gradient text-[clamp(6rem,20vw,12rem)] leading-none font-bold">404</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">This page can’t be found.</h1>
        <p className="mx-auto mt-3 max-w-md text-slate">It looks like nothing was found at this location. Try the shop or head back home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-amber">Back to home</Link>
          <Link href="/shop/" className="btn-ghost">Browse products <ArrowRight className="size-4" /></Link>
        </div>
      </Reveal>
    </section>
  );
}
