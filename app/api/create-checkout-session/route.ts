import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Donation } from "@/database/models/donationSchema";
import dbConnect from "@/database/dbConfig";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { amount, clerkId } = await req.json();

    if (!amount || !clerkId) {
      return NextResponse.json({ error: "Missing amount or clerkId" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `donation_rcpt_${Date.now()}`,
    });

    await Donation.create({
      clerkId,
      amount,
      currency: "INR",
      orderId: order.id,
      paymentId: order.id,
      status: "pending",
      purpose: "Tree Plantation",
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
