import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/database/dbConfig";
import { Donation } from "@/database/models/donationSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  await dbConnect();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Update donation status in DB
    await Donation.findOneAndUpdate(
      { paymentId: session.id },
      { status: "success" }
    );
  }

  return NextResponse.json({ received: true });
}
