
// // import { NextResponse } from "next/server";
// // import Razorpay from "razorpay";

// // export async function POST(req: Request) {
// //   try {
// //     console.log(`Request came here for create-order`);
// //     const { amount } = await req.json();

// //     // Initialize Razorpay
// //     const razorpay = new Razorpay({
// //       key_id: process.env.RAZORPAY_KEY_ID!,
// //       key_secret: process.env.RAZORPAY_KEY_SECRET!,
// //     });

// //     // Create order (amount in paise)
// //     const order = await razorpay.orders.create({
// //       amount: amount * 100, // INR paise
// //       currency: "INR",
// //       receipt: `donation_rcpt_${Date.now()}`,
// //     });

// //     return NextResponse.json({ success: true, order });
// //   } catch (error) {
// //     console.error("Order creation failed", error);
// //     return NextResponse.json(
// //       { success: false, error: "Failed to create order" },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil", // use latest version from types
// });

// export async function POST(req: Request) {
//   try {
//     const { amount } = await req.json();

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: process.env.CURRENCY || "INR",
//             product_data: { name: "Tree Plantation Donation" },
//             unit_amount: amount * 100, // in paise
//           },
//           quantity: 1,
//         },
//       ],
//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donation-cancel`,
//     });

//     return NextResponse.json({ success: true, url: session.url });
//   } catch (err) {
//     console.error("Stripe Checkout error:", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to create Stripe session" },
//       { status: 500 }
//     );
//   }
// }
// /api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Donation } from "@/database/models/donationSchema";
import dbConnect from "@/database/dbConfig"; // your mongoose connect function
import { User } from "@/database/models/userSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { amount, clerkId } = await req.json();

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY || "INR",
            product_data: { name: "Tree Plantation Donation" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donation-cancel`,
    });

    // Save donation entry in DB
    
  
    await Donation.create({
      clerkId, // directly pass {clerkId}
      amount,
      currency: process.env.CURRENCY || "INR",
      paymentId: session.id,
      status: "pending",
      purpose: "Tree Plantation",
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create Stripe session" },
      { status: 500 }
    );
  }
}
