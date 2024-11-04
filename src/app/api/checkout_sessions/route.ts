import { NextRequest, NextResponse } from "next/server";
import Order from "../../../models/Order";
import connectToDatabase from "@/lib/connectDataBase";
import stripe from "@/lib/connectStripe";

export async function GET() {
  await connectToDatabase();
  try {
    const orders = await Order.find({}).populate("products.product");
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();

  console.log(body);

  const products = body.products.map(
    (product: { product: string; quantity: number }) => ({
      price: product.product,
      quantity: product.quantity,
    })
  );
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: products,
      mode: "payment",
      return_url: `${req.nextUrl.origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log(session.client_secret);

    if (!session) {
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({
      success: true,
      clientSecret: session.client_secret,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const order = await Order.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}
