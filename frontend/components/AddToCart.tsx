"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "./StoreProvider";
import { money, priceLabel, variationLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export function AddToCart({ product: p }: { product: Product }) {
  const { addToCart, toggleWish, inWishlist, ready } = useStore();
  const [qty, setQty] = useState(1);
  // Preselect the first option of each attribute, like the original store did.
  const [picked, setPicked] = useState<Record<string, string>>(() =>
    Object.fromEntries(p.attributes.filter((a) => p.variations.length).map((a) => [a.name, p.variations[0]?.attributes[a.name] ?? a.options[0]]))
  );
  const [added, setAdded] = useState(false);

  const variation = useMemo(
    () => (p.variations.length ? p.variations.find((v) => Object.entries(v.attributes).every(([k, val]) => picked[k] === val)) ?? null : null),
    [p.variations, picked]
  );
  const needsOption = p.variations.length > 0 && !variation;
  const inStock = variation ? variation.inStock : p.inStock;
  const price = variation ? variation.price : p.price;
  const wished = ready && inWishlist(p.id);

  const isAvailable = (attr: string, value: string) =>
    p.variations.some((v) => v.attributes[attr] === value && Object.entries(picked).every(([k, val]) => k === attr || v.attributes[k] === val));

  const add = () => {
    if (needsOption || !inStock) return;
    addToCart(
      {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images[0]?.src || "",
        price,
        variationId: variation?.id ?? null,
        variationLabel: variation ? variationLabel(variation.attributes) : "",
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.p
          key={variation?.id ?? "base"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-3xl font-semibold text-heading sm:text-[34px]"
        >
          {variation ? money(variation.price) : priceLabel(p)}
        </motion.p>
      </AnimatePresence>

      <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-coral"}`}>
        <span className={`size-2 rounded-full ${inStock ? "bg-green-500" : "bg-coral"}`} /> {inStock ? "In stock" : "Out of stock"}
      </p>

      {p.variations.length > 0 &&
        p.attributes.map((a) => (
          <fieldset key={a.name} className="mt-7">
            <legend className="mb-3 text-sm font-semibold tracking-[1px] text-heading uppercase">
              {a.name}: <span className="font-normal text-muted normal-case">{picked[a.name] ?? "Choose an option"}</span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {a.options.map((o) => {
                const active = picked[a.name] === o;
                const available = isAvailable(a.name, o);
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={active}
                    disabled={!available}
                    onClick={() => setPicked((s) => ({ ...s, [a.name]: o }))}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
                      active ? "text-ink" : "bg-white text-heading ring-1 ring-black/10 hover:ring-amber"
                    }`}
                  >
                    {active && <motion.span layoutId={`opt-${a.name}`} className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    <span className="relative">{o}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full bg-white ring-1 ring-black/10">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3.5 hover:text-amber">
            <Minus className="size-4" />
          </button>
          <label htmlFor="qty" className="sr-only">{p.name} quantity</label>
          <input
            id="qty"
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-12 [appearance:textfield] bg-transparent text-center font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(50, q + 1))} className="p-3.5 hover:text-amber">
            <Plus className="size-4" />
          </button>
        </div>
        <button type="button" onClick={add} disabled={needsOption || !inStock} className="btn-amber flex-1 px-6 whitespace-nowrap sm:flex-none sm:px-8">
          {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />} {added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => toggleWish({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0]?.src || "", priceLabel: priceLabel(p) })}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`grid size-[58px] place-items-center rounded-full ring-1 transition-colors ${wished ? "bg-coral text-white ring-coral" : "bg-white text-heading ring-black/10 hover:text-coral"}`}
        >
          <Heart className="size-5" fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      {needsOption && <p className="mt-3 text-sm text-coral">Please select some product options before adding this product to your cart.</p>}
    </div>
  );
}
