import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { serialize } from "@/lib/serialize";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

/** Public order lookup: requires both the order number and the checkout email. */
export const POST = handler(async (req: NextRequest) => {
  const { orderNumber, email } = z
    .object({ orderNumber: z.string().trim().toUpperCase().min(4), email: z.string().trim().toLowerCase().email() })
    .parse(await req.json());
  await connectDB();
  const order = await Order.findOne({ orderNumber, "customer.email": email }).lean();
  if (!order) throw new HttpError(404, "We couldn't find an order with those details");
  return ok(serialize(order as unknown as Record<string, unknown>));
});
