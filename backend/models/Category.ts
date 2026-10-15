import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    wpId: Number,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    group: { type: String, enum: ["mobile-phones", "accessories", "other"], default: "other" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;

export const Category: Model<CategoryDoc> =
  (mongoose.models.Category as Model<CategoryDoc>) || mongoose.model<CategoryDoc>("Category", CategorySchema);
