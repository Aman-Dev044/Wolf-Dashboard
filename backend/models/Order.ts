import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    slug: String,
    name: { type: String, required: true },
    image: String,
    variationId: { type: String, default: null },
    variationLabel: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, index: true },
      phone: { type: String, required: true },
    },
    fulfilment: {
      method: { type: String, enum: ["delivery", "pickup"], required: true },
      store: { type: String, default: "" },
      preferredDate: { type: String, default: "" },
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postcode: String,
        country: { type: String, default: "AU" },
      },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "AUD" },
    paymentMethod: { type: String, enum: ["pay-in-store", "bank-transfer"], default: "pay-in-store" },
    status: {
      type: String,
      enum: ["pending", "processing", "ready-for-pickup", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: "" },
    history: { type: [{ status: String, at: Date, note: String, _id: false }], default: [] },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;

export const Order: Model<OrderDoc> = (mongoose.models.Order as Model<OrderDoc>) || mongoose.model<OrderDoc>("Order", OrderSchema);
