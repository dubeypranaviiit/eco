import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) return NextResponse.json({ error: "No session ID provided" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      amount: session.amount_total! / 100,
      paymentId: session.payment_intent,
    });
  } catch (err) {
    console.error("Failed to retrieve session:", err);
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
