import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export const GET = handler(async (_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  await connectDB();
  const c = await Category.findOne({ slug }).lean();
  if (!c) throw new HttpError(404, "Category not found");
  const count = await Product.countDocuments({ published: true, categories: slug });
  return ok({ id: String(c._id), name: c.name, slug: c.slug, group: c.group, description: c.description, image: c.image, count });
});
