import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Donation } from "@/database/models/donationSchema";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const sessionId = url.searchParams.get("sessionId");

//   if (!sessionId) return NextResponse.json({ error: "No session ID provided" }, { status: 400 });

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     return NextResponse.json({
//       amount: session.amount_total! / 100,
//       paymentId: session.payment_intent,
//     });
//   } catch (err) {
//     console.error("Failed to retrieve session:", err);
//     return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
//   }
// }
// app/api/checkout-session/route.ts
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
  }

  try {
    // 1️⃣ Get the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2️⃣ Get the PaymentIntent
    if (!session.payment_intent) {
      return NextResponse.json({ error: "No payment intent found for this session" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    console.log(paymentIntent.status); // "succeeded" when payment completed
       const donation = await Donation.findOneAndUpdate(
        { paymentId: session.id }, // or session.payment_intent
        { status: "success" },
        { new: true }
      );

    // 3️⃣ Return session + payment info to frontend
    return NextResponse.json({
      amount: session.amount_total! / 100,
      paymentId: session.payment_intent,
      status: paymentIntent.status === "succeeded" ? "success" : "pending",
    });
  } catch (err) {
    console.error("Failed to retrieve session:", err);
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
