"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import type { Order } from "@/lib/types";

export function OrderReceived() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wolf:last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  return (
    <section className="bg-mist py-16 lg:py-24">
      <div className="container-wolf max-w-3xl">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto grid size-20 place-items-center rounded-full bg-amber text-ink shadow-[0_0_0_12px_rgba(252,173,56,0.2)]"
          >
            <Check className="size-10" strokeWidth={3} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-4xl font-bold text-navy sm:text-5xl">
            Thank you. Your order has been received.
          </motion.h1>
          {order && (
            <p className="mt-4 text-muted">
              Our team will contact you at <strong className="text-heading">{order.customer.email}</strong>. Keep your order number to track your package.
            </p>
          )}
        </div>
        {order && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-10">
            <OrderSummary order={order} />
          </motion.div>
        )}
        {loaded && !order && <p className="mt-6 text-center text-muted">We couldn't load your order details in this browser, but your order was placed.</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/tracking/" className="btn-amber">Track your order</Link>
          <Link href="/shop/" className="inline-flex items-center rounded-full px-6 py-3 font-medium text-heading ring-1 ring-black/10 hover:ring-amber">Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}
