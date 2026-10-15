import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ImageSchema = new Schema({ src: { type: String, required: true }, alt: { type: String, default: "" } }, { _id: false });

const VariationSchema = new Schema(
  {
    wpId: Number,
    attributes: { type: Map, of: String, default: {} },
    price: { type: Number, required: true },
    regularPrice: Number,
    inStock: { type: Boolean, default: true },
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    wpId: { type: Number, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["simple", "variable"], default: "simple" },
    sku: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    regularPrice: Number,
    priceMin: Number,
    priceMax: Number,
    currency: { type: String, default: "AUD" },
    onSale: { type: Boolean, default: false },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    images: { type: [ImageSchema], default: [] },
    categories: { type: [String], index: true, default: [] },
    attributes: { type: [{ name: String, options: [String], _id: false }], default: [] },
    variations: { type: [VariationSchema], default: [] },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

ProductSchema.pre("save", function (next) {
  const prices = this.variations.length ? this.variations.map((v) => v.price) : [this.price];
  this.priceMin = Math.min(...prices);
  this.priceMax = Math.max(...prices);
  this.price = this.priceMin;
  next();
});

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) || mongoose.model<ProductDoc>("Product", ProductSchema);
