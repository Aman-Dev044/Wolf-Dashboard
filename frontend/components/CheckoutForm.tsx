"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Lock, ShoppingBag, Store, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./StoreProvider";
import { api } from "@/lib/client-api";
import { money } from "@/lib/format";
import type { Order, Store as StoreT } from "@/lib/types";

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

export function CheckoutForm({ stores, notice }: { stores: StoreT[]; notice: string }) {
  const router = useRouter();
  const { cart, ready, subtotal, clearCart, user } = useStore();
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [payment, setPayment] = useState<"pay-in-store" | "bank-transfer">("pay-in-store");
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    store: stores[0]?.name ?? "",
    preferredDate: "",
    line1: "",
    line2: "",
    city: "",
    state: "VIC",
    postcode: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name.split(" ");
      setF((s) => ({ ...s, firstName: s.firstName || firstName, lastName: s.lastName || rest.join(" "), email: s.email || user.email, phone: s.phone || user.phone }));
    }
  }, [user]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api<Order>("/orders", {
        method: "POST",
        json: {
          customer: { firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone },
          fulfilment: {
            method,
            store: method === "pickup" ? f.store : "",
            preferredDate: f.preferredDate,
            address: method === "delivery" ? { line1: f.line1, line2: f.line2, city: f.city, state: f.state, postcode: f.postcode, country: "AU" } : undefined,
          },
          items: cart.map((l) => ({ productId: l.productId, variationId: l.variationId, quantity: l.quantity })),
          paymentMethod: payment,
          notes: f.notes,
        },
      });
      try {
        sessionStorage.setItem("wolf:last-order", JSON.stringify(order));
      } catch {}
      clearCart();
      router.push(`/checkout/order-received/?order=${order.orderNumber}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  if (!ready) return <div className="h-96 animate-pulse rounded-[24px] bg-white" />;
  if (!cart.length)
    return (
      <div className="grid place-items-center rounded-[24px] bg-white px-6 py-20 text-center ring-1 ring-black/5">
        <ShoppingBag className="size-14 text-amber" />
        <p className="mt-4 text-xl font-medium text-heading">Your cart is currently empty.</p>
        <Link href="/shop/" className="btn-amber mt-6">Return to shop</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <motion.fieldset initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-xl sm:p-8">
          <legend className="sr-only">Contact details</legend>
          <h2 className="text-xl font-semibold text-heading">Contact details</h2>
          {!user && (
            <p className="mt-1 text-sm text-muted">
              Returning customer? <Link href="/my-account/?next=/checkout/" className="text-amber underline underline-offset-4">Click here to login</Link>
            </p>
          )}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name *"><input required autoComplete="given-name" value={f.firstName} onChange={set("firstName")} className="field" /></Field>
            <Field label="Last name *"><input required autoComplete="family-name" value={f.lastName} onChange={set("lastName")} className="field" /></Field>
            <Field label="Email address *"><input required type="email" autoComplete="email" value={f.email} onChange={set("email")} className="field" /></Field>
            <Field label="Phone *"><input required type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} className="field" /></Field>
          </div>
        </motion.fieldset>

        <motion.fieldset initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-xl sm:p-8">
          <legend className="sr-only">Delivery or pickup</legend>
          <h2 className="text-xl font-semibold text-heading">Delivery or pickup</h2>
          <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup">
            {([
              { v: "pickup", label: "Pick up in store", Icon: Store },
              { v: "delivery", label: "Delivery", Icon: Truck },
            ] as const).map(({ v, label, Icon }) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={method === v}
                onClick={() => setMethod(v)}
                className={`relative flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold ring-1 transition-all ${method === v ? "ring-2 ring-amber" : "ring-black/10 hover:ring-amber/60"}`}
              >
                <Icon className={`size-5 ${method === v ? "text-amber" : "text-muted"}`} /> {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {method === "pickup" ? (
              <motion.div key="pickup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Pickup store *">
                  <select required value={f.store} onChange={set("store")} className="field">
                    {stores.map((s) => (
                      <option key={s.slug} value={s.name}>{s.name} – {s.city}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Preferred pickup date">
                  <input type="date" min={new Date().toISOString().slice(0, 10)} value={f.preferredDate} onChange={set("preferredDate")} className="field" />
                </Field>
              </motion.div>
            ) : (
              <motion.div key="delivery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Street address *" wide><input required autoComplete="address-line1" placeholder="House number and street name" value={f.line1} onChange={set("line1")} className="field" /></Field>
                <Field label="Apartment, suite, unit, etc." wide><input autoComplete="address-line2" value={f.line2} onChange={set("line2")} className="field" /></Field>
                <Field label="Suburb *"><input required autoComplete="address-level2" value={f.city} onChange={set("city")} className="field" /></Field>
                <Field label="State *">
                  <select value={f.state} onChange={set("state")} className="field">{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                </Field>
                <Field label="Postcode *"><input required inputMode="numeric" pattern="\d{4}" autoComplete="postal-code" value={f.postcode} onChange={set("postcode")} className="field" /></Field>
                <Field label="Preferred delivery date">
                  <input type="date" min={new Date().toISOString().slice(0, 10)} value={f.preferredDate} onChange={set("preferredDate")} className="field" />
                </Field>
                {notice && <p className="rounded-2xl bg-amber/10 p-4 text-sm leading-6 text-heading sm:col-span-2">{notice}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.fieldset>

        <motion.fieldset initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-xl sm:p-8">
          <legend className="sr-only">Payment</legend>
          <h2 className="text-xl font-semibold text-heading">Payment</h2>
          <div className="mt-5 space-y-3">
            {([
              { v: "pay-in-store", label: "Pay in store", text: "Pay when you collect your order or our team will call you to arrange payment." },
              { v: "bank-transfer", label: "Direct bank transfer", text: "Our team will send you bank details. Your order ships once the funds have cleared." },
            ] as const).map((o) => (
              <label key={o.v} className={`flex cursor-pointer gap-3 rounded-2xl p-4 ring-1 transition-all ${payment === o.v ? "ring-2 ring-amber" : "ring-black/10"}`}>
                <input type="radio" name="payment" checked={payment === o.v} onChange={() => setPayment(o.v)} className="mt-1 accent-[#fcad38]" />
                <span>
                  <span className="block font-semibold text-heading">{o.label}</span>
                  <span className="block text-sm text-muted">{o.text}</span>
                </span>
              </label>
            ))}
          </div>
          <Field label="Order notes (optional)" className="mt-5">
            <textarea rows={3} value={f.notes} onChange={set("notes")} placeholder="Notes about your order, e.g. special notes for delivery." className="field" />
          </Field>
        </motion.fieldset>
      </div>

      <motion.aside initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="h-fit rounded-[24px] bg-ink p-7 text-white lg:sticky lg:top-24">
        <h2 className="text-2xl font-semibold">Your order</h2>
        <ul className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">
          {cart.map((l) => (
            <li key={l.key} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image src={l.image || "/uploads/2026/07/dark-logo.png"} alt="" fill sizes="56px" className="object-contain p-1 transition-[scale] duration-500 hover:scale-110" />
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-amber text-[10px] font-bold text-ink">{l.quantity}</span>
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="line-clamp-1">{l.name}</span>
                {l.variationLabel && <span className="block text-xs text-slate">{l.variationLabel}</span>}
              </span>
              <span className="text-sm font-semibold">{money(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd>{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate">{method === "pickup" ? "Pickup" : "Delivery"}</dt><dd>{method === "pickup" ? "Free" : "Confirmed by our team"}</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-semibold"><dt>Total</dt><dd className="text-amber">{money(subtotal)}</dd></div>
        </dl>
        {error && <p role="alert" className="mt-5 rounded-xl bg-coral/15 p-3 text-sm text-coral">{error}</p>}
        <button type="submit" disabled={busy} className="btn-amber mt-6 w-full">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-5" />} Place order
        </button>
        <p className="mt-4 text-center text-xs text-slate">Your personal data will be used to process your order and support your experience on this website.</p>
      </motion.aside>
    </form>
  );
}

function Field({ label, children, wide, className = "" }: { label: string; children: React.ReactNode; wide?: boolean; className?: string }) {
  return (
    <label className={`block text-sm font-medium text-heading ${wide ? "sm:col-span-2" : ""} ${className}`}>
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
