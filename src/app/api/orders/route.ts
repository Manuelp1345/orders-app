import { NextRequest, NextResponse } from "next/server";
import Order from "../../../models/Order";
import connectToDatabase from "@/lib/connectDataBase";

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

  try {
    const body = await req.json();
    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
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

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { id } = await req.json();
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}
