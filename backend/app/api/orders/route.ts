import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { readToken, requireUser } from "@/lib/auth";
import { serialize } from "@/lib/serialize";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

const OrderInput = z
  .object({
    customer: z.object({
      firstName: z.string().trim().min(1, "First name is required"),
      lastName: z.string().trim().min(1, "Last name is required"),
      email: z.string().trim().toLowerCase().email("Valid email is required"),
      phone: z.string().trim().min(6, "Phone is required"),
    }),
    fulfilment: z.object({
      method: z.enum(["delivery", "pickup"]),
      store: z.string().trim().optional().default(""),
      preferredDate: z.string().trim().optional().default(""),
      address: z
        .object({
          line1: z.string().trim().default(""),
          line2: z.string().trim().optional().default(""),
          city: z.string().trim().default(""),
          state: z.string().trim().default(""),
          postcode: z.string().trim().default(""),
          country: z.string().trim().default("AU"),
        })
        .optional(),
    }),
    items: z
      .array(
        z.object({
          productId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid product"),
          variationId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid product option").nullable().optional(),
          quantity: z.number().int().min(1).max(50),
        })
      )
      .min(1, "Your cart is empty"),
    paymentMethod: z.enum(["pay-in-store", "bank-transfer"]).default("pay-in-store"),
    notes: z.string().trim().max(2000).optional().default(""),
  })
  .superRefine((o, ctx) => {
    if (o.fulfilment.method === "pickup" && !o.fulfilment.store) {
      ctx.addIssue({ code: "custom", path: ["fulfilment", "store"], message: "Please choose a pickup store" });
    }
    const a = o.fulfilment.address;
    if (o.fulfilment.method === "delivery" && (!a || !a.line1 || !a.city || !a.postcode || !a.state)) {
      ctx.addIssue({ code: "custom", path: ["fulfilment", "address"], message: "Please enter your full delivery address" });
    }
  });

function orderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `WLF-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export const POST = handler(async (req: NextRequest) => {
  const input = OrderInput.parse(await req.json());
  await connectDB();

  // Prices always come from the database, never from the client.
  const ids = [...new Set(input.items.map((i) => i.productId))];
  const products = await Product.find({ _id: { $in: ids }, published: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = input.items.map((line) => {
    const p = byId.get(line.productId);
    if (!p) throw new HttpError(400, "A product in your cart is no longer available");
    let price = p.price;
    let variationLabel = "";
    if (p.variations.length) {
      const v = p.variations.find((x) => String(x._id) === line.variationId);
      if (!v) throw new HttpError(400, `Please choose an option for ${p.name}`);
      if (!v.inStock) throw new HttpError(400, `${p.name} (${[...v.attributes.values()].join(", ")}) is out of stock`);
      price = v.price;
      variationLabel = [...v.attributes.entries()].map(([k, val]) => `${k}: ${val}`).join(", ");
    } else if (!p.inStock) {
      throw new HttpError(400, `${p.name} is out of stock`);
    }
    return {
      product: p._id,
      slug: p.slug,
      name: p.name,
      image: p.images[0]?.src || "",
      variationId: line.variationId || null,
      variationLabel,
      price,
      quantity: line.quantity,
      lineTotal: Math.round(price * line.quantity * 100) / 100,
    };
  });

  const subtotal = Math.round(items.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100;
  const fee = Number(process.env.DELIVERY_FEE || 0);
  const threshold = Number(process.env.FREE_DELIVERY_THRESHOLD || 0);
  const deliveryFee = input.fulfilment.method === "delivery" && !(threshold && subtotal >= threshold) ? fee : 0;
  const user = readToken(req);

  const order = await Order.create({
    orderNumber: orderNumber(),
    user: user?.sub ?? null,
    customer: input.customer,
    fulfilment: input.fulfilment,
    items,
    subtotal,
    deliveryFee,
    total: Math.round((subtotal + deliveryFee) * 100) / 100,
    paymentMethod: input.paymentMethod,
    notes: input.notes,
    history: [{ status: "pending", at: new Date(), note: "Order received" }],
  });

  return ok(serialize(order.toObject() as unknown as Record<string, unknown>), { status: 201 });
});

/** Orders of the signed-in customer (or every order for admins). */
export const GET = handler(async (req: NextRequest) => {
  const user = requireUser(req);
  await connectDB();
  const filter = user.role === "admin" ? {} : { $or: [{ user: user.sub }, { "customer.email": user.email }] };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return ok(orders.map((o) => serialize(o as unknown as Record<string, unknown>)));
});
