"use client";

import { motion } from "motion/react";
import { Loader2, PackageSearch } from "lucide-react";
import { useState } from "react";
import { OrderSummary, statusLabel } from "@/components/OrderSummary";
import { api } from "@/lib/client-api";
import type { Order } from "@/lib/types";

const STEPS = ["pending", "processing", "ready-for-pickup", "shipped", "completed"];

export function TrackingForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await api<Order>("/orders/track", { method: "POST", json: { orderNumber, email } }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const steps = order?.fulfilment.method === "pickup" ? STEPS.filter((s) => s !== "shipped") : STEPS.filter((s) => s !== "ready-for-pickup");
  const current = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="space-y-8">
      <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} onSubmit={submit} className="grid gap-4 rounded-[24px] bg-white p-6 ring-1 ring-black/5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8">
        <label className="block text-sm font-medium text-heading">
          Order number
          <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="WLF-XXXXXX-XXXXX" className="field mt-1.5 uppercase" />
        </label>
        <label className="block text-sm font-medium text-heading">
          Billing email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email you used during checkout" className="field mt-1.5" />
        </label>
        <button type="submit" disabled={busy} className="btn-amber">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <PackageSearch className="size-5" />} Track
        </button>
        {error && <p role="alert" className="text-sm text-coral sm:col-span-3">{error}</p>}
      </motion.form>

      {order && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {order.status !== "cancelled" ? (
            <ol className="grid grid-cols-4 gap-2 rounded-[24px] bg-ink p-6 text-white">
              {steps.map((s, i) => (
                <li key={s} className="text-center">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.12 }}
                    className={`mx-auto grid size-10 place-items-center rounded-full text-sm font-bold ${i <= current ? "bg-amber text-ink" : "bg-white/10 text-slate"}`}
                  >
                    {i + 1}
                  </motion.span>
                  <span className={`mt-2 block text-xs sm:text-sm ${i <= current ? "text-white" : "text-slate"}`}>{statusLabel(s)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-2xl bg-coral/10 p-4 text-coral">This order has been cancelled.</p>
          )}
          <OrderSummary order={order} />
        </motion.div>
      )}
    </div>
  );
}
