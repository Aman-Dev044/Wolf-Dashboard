import { pageMeta } from "@/lib/seo";
import { OrderReceived } from "./OrderReceived";

export const metadata = pageMeta({ title: "Order received", path: "/checkout/order-received/", noindex: true });

export default function OrderReceivedPage() {
  return <OrderReceived />;
}
