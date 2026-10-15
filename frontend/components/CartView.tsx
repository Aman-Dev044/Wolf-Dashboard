"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "./StoreProvider";
import { money } from "@/lib/format";

export function CartView() {
  const { cart, ready, subtotal, updateQty, removeLine } = useStore();

  if (!ready) return <div className="h-80 animate-pulse rounded-[24px] bg-white" />;

  if (!cart.length)
    return (
      <div className="grid place-items-center rounded-[24px] bg-white px-6 py-20 text-center ring-1 ring-black/5">
        <ShoppingBag className="size-14 text-amber" />
        <p className="mt-4 text-xl font-medium text-heading">Your cart is currently empty.</p>
        <Link href="/shop/" className="btn-amber mt-6">Return to shop</Link>
      </div>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-4">
        <AnimatePresence initial={false}>
          {cart.map((l) => (
            <motion.li
              key={l.key}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="flex flex-wrap items-center gap-4 rounded-[24px] bg-white p-4 ring-1 ring-black/5 sm:flex-nowrap sm:p-5"
            >
              <Link href={`/product/${l.slug}/`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-mist">
                <Image src={l.image || "/uploads/2026/07/dark-logo.png"} alt={l.name} fill sizes="96px" className="object-contain p-2 transition-[scale] duration-500 hover:scale-110" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${l.slug}/`} className="text-lg font-medium text-heading hover:text-amber">{l.name}</Link>
                {l.variationLabel && <p className="text-sm text-muted">{l.variationLabel}</p>}
                <p className="mt-1 text-sm text-muted">{money(l.price)} each</p>
              </div>
              <div className="flex items-center rounded-full ring-1 ring-black/10">
                <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(l.key, l.quantity - 1)} className="p-2.5 hover:text-amber"><Minus className="size-4" /></button>
                <span className="w-8 text-center font-semibold">{l.quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => updateQty(l.key, l.quantity + 1)} className="p-2.5 hover:text-amber"><Plus className="size-4" /></button>
              </div>
              <p className="w-28 text-right text-lg font-semibold text-heading">{money(l.price * l.quantity)}</p>
              <button type="button" aria-label={`Remove ${l.name}`} onClick={() => removeLine(l.key)} className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-coral">
                <Trash2 className="size-5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <motion.aside initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="h-fit rounded-[24px] bg-ink p-7 text-white lg:sticky lg:top-24">
        <h2 className="text-2xl font-semibold">Cart totals</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd>{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate">Delivery / Pickup</dt><dd className="text-slate">Calculated at checkout</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-semibold"><dt>Total</dt><dd className="text-amber">{money(subtotal)}</dd></div>
        </dl>
        <Link href="/checkout/" className="btn-amber mt-7 w-full">Proceed to checkout <ArrowRight className="size-5" /></Link>
        <Link href="/shop/" className="mt-4 block text-center text-sm text-slate hover:text-amber">Continue shopping</Link>
      </motion.aside>
    </div>
  );
}
