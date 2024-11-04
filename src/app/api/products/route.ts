import { NextRequest, NextResponse } from "next/server";
import Product from "../../../models/Product";
import connectToDatabase from "@/lib/connectDataBase";
import stripe from "@/lib/connectStripe";

export async function GET() {
  await connectToDatabase();

  try {
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body = await req.json();
  //create product on stripe
  let productStripe;

  try {
    productStripe = await stripe.products.create({
      name: body.name,
      images: [body.image],
      default_price_data: {
        currency: "usd",
        unit_amount: body.price * 100,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }

  const idProduct = productStripe.id;
  const idProductPrice = productStripe.default_price;
  body.stripeId = idProduct;
  body.stripePriceId = idProductPrice;
  try {
    const product = await Product.create(body);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { _id: id } = await req.json();

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}
