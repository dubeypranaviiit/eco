import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/database/dbConfig";
import { Donation } from "@/database/models/donationSchema";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: "Razorpay webhook secret not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await dbConnect();

    if (event.event === "order.paid" || event.event === "payment.captured") {
      const payment = event.payload.payment?.entity;
      const orderId = payment?.order_id || event.payload.order?.entity?.id;
      const paymentId = payment?.id;

      if (!orderId || !paymentId) {
        return NextResponse.json({ error: "Missing order or payment info in event payload" }, { status: 400 });
      }

      const existingSuccessPayment = await Donation.findOne({ paymentId, status: "success" });
      if (existingSuccessPayment) {
        return NextResponse.json({ received: true });
      }

      const pendingDonation = await Donation.findOne({ paymentId: orderId });

      if (pendingDonation) {
        if (pendingDonation.status === "success") {
          return NextResponse.json({ received: true });
        }
        pendingDonation.paymentId = paymentId;
        pendingDonation.status = "success";
        await pendingDonation.save();
      } else {
        const clerkId = payment.notes?.clerkId || "anonymous";
        const amount = payment.amount / 100;
        await Donation.create({
          clerkId,
          amount,
          currency: payment.currency || "INR",
          paymentId: paymentId,
          status: "success",
          purpose: "Tree Plantation",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Razorpay Webhook handler error:", err);
    return NextResponse.json({ error: err.message || "Webhook handling failed" }, { status: 500 });
  }
}
