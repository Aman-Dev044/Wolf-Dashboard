"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "./AnimatedImage";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Telstra-style plan card: picture, tag chip, name, price and the 36-month minimum cost note. The whole card links to the product. */
export function TrendingCard({ product: p, tag }: { product: Product; tag?: string }) {
  const img = p.images[0];
  const min = p.priceMin ?? p.price;
  const price = min === (p.priceMax ?? p.price) ? money(min) : `From ${money(min)}`;

  return (
    <Link
      href={`/product/${p.slug}/`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative flex h-full flex-col rounded-[24px] bg-white p-5 ring-1 ring-black/5 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgba(252,173,56,0.45)] sm:p-6 lg:rounded-[28px] lg:p-7"
    >
      {/* Amber spotlight that follows the pointer across the card. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(340px_circle_at_var(--mx,50%)_var(--my,50%),rgba(252,173,56,0.14),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <ImageReveal wipe="up" duration={1}>
          {img && (
            <Image
              data-anim=""
              src={img.src}
              alt={img.alt || p.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain object-left transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          )}
        </ImageReveal>
        {!p.inStock && <span className="absolute top-0 right-0 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Out of stock</span>}
      </div>

      {tag && (
        <span className="relative mt-4 self-start rounded-lg bg-[#f1f1f4] px-3 py-1.5 text-xs font-semibold tracking-[0.5px] text-heading uppercase sm:mt-5 sm:px-4 sm:text-sm">
          {tag}
        </span>
      )}

      <h3 className="relative mt-4 line-clamp-2 text-[15px] leading-snug font-normal text-heading transition-colors group-hover:text-amber sm:mt-4 sm:text-lg">
        {p.name}
      </h3>
      <p className="relative mt-2 text-lg font-semibold text-heading sm:mt-2 sm:text-2xl">{price}</p>
      <p className="relative mt-2 text-xs leading-relaxed tracking-[0.3px] text-muted sm:mt-2 sm:text-sm">
        Min Cost {money(min)} Over 36 Months Plus Your Chosen Plan Costs
      </p>
    </Link>
  );
}
