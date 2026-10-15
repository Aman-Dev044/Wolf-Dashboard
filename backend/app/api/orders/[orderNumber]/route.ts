import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { serialize } from "@/lib/serialize";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ orderNumber: string }> };

/** Admin: update an order's status. */
export const PATCH = handler(async (req: NextRequest, { params }: Ctx) => {
  requireAdmin(req);
  const { orderNumber } = await params;
  const { status, note } = z
    .object({
      status: z.enum(["pending", "processing", "ready-for-pickup", "shipped", "completed", "cancelled"]),
      note: z.string().optional().default(""),
    })
    .parse(await req.json());
  await connectDB();
  const order = await Order.findOneAndUpdate(
    { orderNumber },
    { $set: { status }, $push: { history: { status, at: new Date(), note } } },
    { new: true }
  ).lean();
  if (!order) throw new HttpError(404, "Order not found");
  return ok(serialize(order as unknown as Record<string, unknown>));
});
