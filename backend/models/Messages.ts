import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    store: { type: String, default: "" },
    message: { type: String, default: "" },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SubscriberSchema = new Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true }
);

// Single-document collection holding editable site copy (hero, stores, team, awards...).
const SiteContentSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, required: true } },
  { timestamps: true, minimize: false }
);

export type ContactDoc = InferSchemaType<typeof ContactSchema>;
export type SubscriberDoc = InferSchemaType<typeof SubscriberSchema>;
export type SiteContentDoc = InferSchemaType<typeof SiteContentSchema>;

export const Contact: Model<ContactDoc> =
  (mongoose.models.Contact as Model<ContactDoc>) || mongoose.model<ContactDoc>("Contact", ContactSchema);
export const Subscriber: Model<SubscriberDoc> =
  (mongoose.models.Subscriber as Model<SubscriberDoc>) || mongoose.model<SubscriberDoc>("Subscriber", SubscriberSchema);
export const SiteContent: Model<SiteContentDoc> =
  (mongoose.models.SiteContent as Model<SiteContentDoc>) || mongoose.model<SiteContentDoc>("SiteContent", SiteContentSchema);
