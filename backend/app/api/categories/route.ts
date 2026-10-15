import { connectDB } from "@/lib/db";
import { handler, ok } from "@/lib/http";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await connectDB();
  const [categories, counts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Product.aggregate<{ _id: string; count: number }>([
      { $match: { published: true } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]),
  ]);
  const countMap = new Map(counts.map((c) => [c._id, c.count]));
  return ok(
    categories
      .map((c) => ({
        id: String(c._id),
        name: c.name,
        slug: c.slug,
        group: c.group,
        description: c.description,
        image: c.image,
        count: countMap.get(c.slug) || 0,
      }))
      .filter((c) => c.count > 0 && c.slug !== "uncategorized")
  );
});
