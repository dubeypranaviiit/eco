import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { Donation } from "@/database/models/donationSchema";
import dbConnect from "@/database/dbConfig";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: "Missing required verification fields" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: "Signature verification failed" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.fetch(orderId);
    const authoritativeAmount = (order.amount as number) / 100;

    const donation = await Donation.findOneAndUpdate(
      { $or: [{ orderId }, { paymentId: orderId }] },
      {
        clerkId: userId,
        amount: authoritativeAmount,
        orderId,
        paymentId,
        status: "success",
        purpose: "Tree Plantation",
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Payment verification failed", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
