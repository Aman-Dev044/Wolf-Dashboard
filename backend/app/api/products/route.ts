import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { escapeRegex, handler, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { Product } from "@/models/Product";
import { ProductInput } from "@/lib/validators";

export const dynamic = "force-dynamic";

const SORTS: Record<string, Record<string, 1 | -1>> = {
  default: { sortOrder: 1 },
  latest: { wpId: -1, createdAt: -1 },
  "price-asc": { priceMin: 1 },
  "price-desc": { priceMin: -1 },
  "name-asc": { name: 1 },
  "name-desc": { name: -1 },
};

export const GET = handler(async (req: NextRequest) => {
  await connectDB();
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 12));
  const filter: Record<string, unknown> = { published: true };

  const category = sp.get("category");
  if (category) filter.categories = { $in: category.split(",") };
  const q = sp.get("q")?.trim();
  if (q) filter.name = { $regex: escapeRegex(q), $options: "i" };
  const min = Number(sp.get("min"));
  const max = Number(sp.get("max"));
  if (min || max) filter.priceMin = { ...(min ? { $gte: min } : {}), ...(max ? { $lte: max } : {}) };
  if (sp.get("featured") === "1") filter.featured = true;
  if (sp.get("inStock") === "1") filter.inStock = true;
  const slugs = sp.get("slugs");
  if (slugs) filter.slug = { $in: slugs.split(",") };
  const exclude = sp.get("exclude");
  if (exclude) filter.slug = { ...(filter.slug as object), $nin: exclude.split(",") };

  const sort = SORTS[sp.get("sort") || "default"] || SORTS.default;
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return ok({
    items: items.map((p) => serializeProduct(p as unknown as Record<string, unknown>)),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
  });
});


export const POST = handler(async (req: NextRequest) => {
  requireAdmin(req);
  await connectDB();
  const data = ProductInput.parse(await req.json());
  const created = await Product.create(data);
  return ok(serializeProduct(created.toObject() as unknown as Record<string, unknown>), { status: 201 });
});
