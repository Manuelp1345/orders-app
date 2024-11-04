import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Please add your Stripe Secret Key to .env.local");
}

const stripe = new Stripe(stripeSecretKey);

export default stripe;
