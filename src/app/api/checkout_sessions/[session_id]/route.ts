import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/connectDataBase";
import stripe from "@/lib/connectStripe";
import Order from "@/models/Order";

export async function GET({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  await connectToDatabase();
  try {
    const { session_id } = await params;

    if (!session_id) {
      return NextResponse.json({ success: false });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return NextResponse.json({ success: false });
    }

    const metadata = JSON.parse(session.metadata?.products as string);

    console.log(metadata);

    const orderData = {
      products: metadata.map((product: any) => ({
        product: product.id,
        quantity: product.quantity,
      })),
      date: new Date(),
      status: "completed",
      isPaid: true,
      stripeSessionId: session_id,
    };

    //validate if the order is already created
    const orderExists = await Order.findOne({
      stripeSessionId: session.id,
    });

    console.log(orderExists);

    if (orderExists) {
      return NextResponse.json({ success: false });
    }

    try {
      const order = await Order.create(orderData);
      return NextResponse.json({ success: true, data: order });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false });
  }
}
