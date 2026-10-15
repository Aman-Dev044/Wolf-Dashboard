"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useStore } from "./StoreProvider";
import { ImageReveal } from "./AnimatedImage";
import { priceLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWish, inWishlist, ready } = useStore();
  const wished = ready && inWishlist(p.id);
  const hasOptions = p.variations.length > 0;
  const img = p.images[0];
  const alt = p.images[1];
  const href = `/product/${p.slug}/`;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col rounded-[20px] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] hover:ring-amber/50"
    >
      <button
        type="button"
        onClick={() => toggleWish({ productId: p.id, slug: p.slug, name: p.name, image: img?.src || "", priceLabel: priceLabel(p) })}
        aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
        aria-pressed={wished}
        className={`absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full transition-all duration-300 ${
          wished ? "bg-coral text-white" : "bg-mist text-heading opacity-100 hover:bg-ink hover:text-amber lg:opacity-0 lg:group-hover:opacity-100"
        }`}
      >
        <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="grid place-items-center">
          <Heart className="size-4" fill={wished ? "currentColor" : "none"} />
        </motion.span>
      </button>

      <Link href={href} className="relative block aspect-square overflow-hidden rounded-2xl bg-white" aria-label={p.name}>
        <ImageReveal wipe="up" duration={1}>
          {img && (
            <Image
              data-anim=""
              src={img.src}
              alt={img.alt || p.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-contain p-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${alt ? "group-hover:opacity-0" : ""}`}
            />
          )}
          {alt && (
            <Image
              data-anim=""
              src={alt.src}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="scale-95 object-contain p-2 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </ImageReveal>
        {!p.inStock && (
          <span className="absolute top-2 left-2 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Out of stock</span>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-[15px] leading-snug font-normal text-heading sm:text-lg">
          <Link href={href} className="line-clamp-2 transition-colors hover:text-amber">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 text-lg font-semibold text-heading sm:text-[22px]">{priceLabel(p)}</p>
        <div className="mt-auto pt-4">
          {hasOptions ? (
            <Link href={href} className="btn-dark w-full sm:w-auto">
              <Eye className="size-4" /> Select options
            </Link>
          ) : (
            <button
              type="button"
              disabled={!p.inStock}
              onClick={() =>
                addToCart({ productId: p.id, slug: p.slug, name: p.name, image: img?.src || "", price: p.price, variationId: null, variationLabel: "" })
              }
              className="btn-dark w-full sm:w-auto"
            >
              <ShoppingBag className="size-4" /> Add to cart
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
