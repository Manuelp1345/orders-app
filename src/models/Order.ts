import { Product } from "@/components/dashboard/products/ProductsPage";
import mongoose, { Schema, Document } from "mongoose";

interface OrderProduct {
  product: mongoose.Schema.Types.ObjectId | Product;
  quantity: number;
}

export interface Order extends Document {
  products: OrderProduct[];
  date: Date;
  status: string;
  isPaid: boolean;
}

const OrderProductSchema: Schema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema({
  products: { type: [OrderProductSchema], required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  stripeSessionId: { type: String },
  isPaid: { type: Boolean, required: true, default: false },
});

export default mongoose.models.Order ||
  mongoose.model<Order>("Order", OrderSchema);
