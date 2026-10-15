import Image from "next/image";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  "ready-for-pickup": "Ready for pickup",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const statusLabel = (s: string) => STATUS[s] ?? s;

export function OrderSummary({ order }: { order: Order }) {
  const a = order.fulfilment.address;
  return (
    <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 sm:p-8">
      <dl className="grid gap-4 border-b border-black/5 pb-6 text-sm sm:grid-cols-4">
        <div><dt className="text-muted">Order number</dt><dd className="mt-1 font-semibold text-heading">{order.orderNumber}</dd></div>
        <div><dt className="text-muted">Date</dt><dd className="mt-1 font-semibold text-heading">{new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
        <div><dt className="text-muted">Total</dt><dd className="mt-1 font-semibold text-heading">{money(order.total)}</dd></div>
        <div><dt className="text-muted">Status</dt><dd className="mt-1"><span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-heading">{statusLabel(order.status)}</span></dd></div>
      </dl>
      <ul className="divide-y divide-black/5">
        {order.items.map((it, i) => (
          <li key={i} className="flex items-center gap-4 py-4">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-mist">
              {it.image && <Image src={it.image} alt="" fill sizes="56px" className="object-contain p-1 transition-[scale] duration-500 hover:scale-110" />}
            </span>
            <span className="flex-1 text-sm">
              <span className="block font-medium text-heading">{it.name} × {it.quantity}</span>
              {it.variationLabel && <span className="text-muted">{it.variationLabel}</span>}
            </span>
            <span className="text-sm font-semibold text-heading">{money(it.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-black/5 pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-muted">{order.fulfilment.method === "pickup" ? "Pickup" : "Delivery"}</dt>
          <dd>{order.fulfilment.method === "pickup" ? order.fulfilment.store : order.deliveryFee ? money(order.deliveryFee) : "To be confirmed"}</dd>
        </div>
        {order.fulfilment.method === "delivery" && a && (
          <div className="flex justify-between gap-6"><dt className="text-muted">Address</dt><dd className="text-right">{[a.line1, a.line2, a.city, a.state, a.postcode].filter(Boolean).join(", ")}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-muted">Payment method</dt><dd>{order.paymentMethod === "pay-in-store" ? "Pay in store" : "Direct bank transfer"}</dd></div>
        <div className="flex justify-between pt-2 text-base font-semibold text-heading"><dt>Total</dt><dd>{money(order.total)}</dd></div>
      </dl>
    </div>
  );
}
