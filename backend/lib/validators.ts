import { z } from "zod";

export const ProductInput = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(["simple", "variable"]).default("simple"),
  sku: z.string().optional(),
  price: z.number().nonnegative(),
  regularPrice: z.number().nonnegative().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  images: z.array(z.object({ src: z.string(), alt: z.string().optional() })).default([]),
  categories: z.array(z.string()).default([]),
  attributes: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).default([]),
  variations: z
    .array(z.object({ attributes: z.record(z.string()), price: z.number().nonnegative(), inStock: z.boolean().default(true) }))
    .default([]),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});
