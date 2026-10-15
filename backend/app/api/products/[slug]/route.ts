import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { ProductInput } from "@/lib/validators";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = handler(async (_req: NextRequest, { params }: Ctx) => {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug, published: true }).lean();
  if (!product) throw new HttpError(404, "Product not found");

  const [related, categories] = await Promise.all([
    Product.find({ published: true, slug: { $ne: slug }, categories: { $in: product.categories } })
      .sort({ sortOrder: 1 })
      .limit(8)
      .lean(),
    Category.find({ slug: { $in: product.categories } }).lean(),
  ]);

  return ok({
    product: serializeProduct(product as unknown as Record<string, unknown>),
    categories: categories.map((c) => ({ name: c.name, slug: c.slug, group: c.group })),
    related: related.map((p) => serializeProduct(p as unknown as Record<string, unknown>)),
  });
});

export const PUT = handler(async (req: NextRequest, { params }: Ctx) => {
  requireAdmin(req);
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug });
  if (!product) throw new HttpError(404, "Product not found");
  product.set(ProductInput.partial().parse(await req.json()));
  await product.save();
  return ok(serializeProduct(product.toObject() as unknown as Record<string, unknown>));
});

export const DELETE = handler(async (req: NextRequest, { params }: Ctx) => {
  requireAdmin(req);
  const { slug } = await params;
  await connectDB();
  const res = await Product.deleteOne({ slug });
  if (!res.deletedCount) throw new HttpError(404, "Product not found");
  return ok({ deleted: true });
});
