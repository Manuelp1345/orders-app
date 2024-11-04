import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: [true, "Please provide a image URL"],
  },

  stripeId: {
    type: String,
    required: [true, "Please provide a stripeId"],
  },

  stripePriceId: {
    type: String,
    required: [true, "Please provide a stripePriceId"],
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
