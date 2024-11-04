import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/connectDataBase";
import stripe from "@/lib/connectStripe";

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
      metadata: {
        products: JSON.stringify(body.products),
      },
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
