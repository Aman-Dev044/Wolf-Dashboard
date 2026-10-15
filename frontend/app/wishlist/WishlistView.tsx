"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Eye, Heart, X } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { AnimatedImage } from "@/components/AnimatedImage";

export function WishlistView() {
  const { wishlist, toggleWish, ready } = useStore();

  if (!ready) return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  if (!wishlist.length)
    return (
      <div className="grid place-items-center rounded-[24px] bg-white px-6 py-20 text-center ring-1 ring-black/5">
        <Heart className="size-14 text-coral" />
        <p className="mt-4 text-xl font-medium text-heading">Your wishlist is currently empty.</p>
        <Link href="/shop/" className="btn-amber mt-6">Return to shop</Link>
      </div>
    );

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence>
        {wishlist.map((w) => (
          <motion.li key={w.productId} layout initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -8 }} className="group relative rounded-[20px] bg-white p-5 ring-1 ring-black/5">
            <button type="button" onClick={() => toggleWish(w)} aria-label={`Remove ${w.name} from wishlist`} className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-mist hover:bg-coral hover:text-white">
              <X className="size-4" />
            </button>
            <Link href={`/product/${w.slug}/`} className="relative block aspect-square overflow-hidden rounded-2xl">
              {w.image && <AnimatedImage src={w.image} alt={w.name} sizes="25vw" className="object-contain p-2" />}
            </Link>
            <h2 className="mt-4 line-clamp-2 text-lg text-heading">{w.name}</h2>
            <p className="mt-1 text-xl font-semibold text-heading">{w.priceLabel}</p>
            <Link href={`/product/${w.slug}/`} className="btn-dark mt-4"><Eye className="size-4" /> View product</Link>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
