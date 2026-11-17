"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "./StoreProvider";
import { money } from "@/lib/format";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, subtotal, updateQty, removeLine, toasts } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              data-lenis-prevent
              className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-ink text-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingBag className="size-5 text-amber" /> Your Cart
                </h2>
                <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" className="rounded-full p-2 hover:bg-white/10">
                  <X className="size-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                  <div className="grid size-20 place-items-center rounded-full bg-white/5">
                    <ShoppingBag className="size-9 text-amber" />
                  </div>
                  <p className="text-base text-slate">No products in the cart.</p>
                  <Link href="/shop/" onClick={() => setCartOpen(false)} className="btn-amber text-sm">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    <AnimatePresence initial={false}>
                      {cart.map((l) => (
                        <motion.li
                          key={l.key}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0 }}
                          className="flex gap-4 rounded-2xl bg-white/[0.04] p-3"
                        >
                          <Link href={`/product/${l.slug}/`} onClick={() => setCartOpen(false)} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white">
                            <Image src={l.image || "/uploads/2026/07/dark-logo.png"} alt={l.name} fill sizes="80px" className="object-contain p-1.5 transition-[scale] duration-500 hover:scale-110" />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={`/product/${l.slug}/`} onClick={() => setCartOpen(false)} className="line-clamp-2 text-base hover:text-amber">
                              {l.name}
                            </Link>
                            {l.variationLabel && <p className="mt-0.5 text-xs text-slate">{l.variationLabel}</p>}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-white/15">
                                <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(l.key, l.quantity - 1)} className="p-1.5 hover:text-amber">
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="w-7 text-center text-sm">{l.quantity}</span>
                                <button type="button" aria-label="Increase quantity" onClick={() => updateQty(l.key, l.quantity + 1)} className="p-1.5 hover:text-amber">
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                              <span className="font-semibold">{money(l.price * l.quantity)}</span>
                            </div>
                          </div>
                          <button type="button" aria-label={`Remove ${l.name}`} onClick={() => removeLine(l.key)} className="self-start p-1 text-slate hover:text-coral">
                            <Trash2 className="size-4" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="border-t border-white/10 px-6 py-5">
                    <div className="mb-4 flex items-center justify-between text-lg">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-amber">{money(subtotal)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/cart/" onClick={() => setCartOpen(false)} className="btn-ghost justify-center text-sm tracking-[1px] uppercase">
                        View Cart
                      </Link>
                      <Link href="/checkout/" onClick={() => setCartOpen(false)} className="btn-amber px-4 py-2.5 text-sm tracking-[1px] uppercase">
                        Checkout
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-2xl ring-1 ring-amber/40"
            >
              <CheckCircle2 className="size-5 shrink-0 text-amber" /> {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
