// // /app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Donation } from "@/database/models/donationSchema";
import dbConnect from "@/database/dbConfig";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const { orderId, paymentId, signature, amount } = await req.json();

//     // Verify signature
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//       .update(orderId + "|" + paymentId)
//       .digest("hex");

//     if (expectedSignature !== signature) {
//       return NextResponse.json(
//         { success: false, error: "Signature verification failed" },
//         { status: 400 }
//       );
//     }

//     const donation = new Donation({
//       clerkId: "user123", 
//       amount,
//       paymentId,
//       status: "success",
//       purpose: "Tree Plantation",
//     });
//     await donation.save();

//     return NextResponse.json({ success: true, donation });
//   } catch (error) {
//     console.error("Payment verification failed", error);
//     return NextResponse.json(
//       { success: false, error: "Payment verification failed" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderId, paymentId, signature, amount, clerkId } = await req.json();

    // Verify Razorpay signature
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

    const donation = new Donation({
      clerkId, // ✅ real user id from Clerk
      orderId,
      amount,
      paymentId,
      status: "success",
      purpose: "Tree Plantation",
    });

    await donation.save();

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Payment verification failed", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
