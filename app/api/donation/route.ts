import { NextResponse } from "next/server";
import { Donation } from "@/database/models/donationSchema";
// import connectDB from "@/database/connectDB";
import dbConnect from "@/database/dbConfig";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { clerkId, amount, paymentId, status, purpose } = await req.json();

    const donation = new Donation({
      clerkId: clerkId || "anonymous",
      amount,
      paymentId,
      status,
      purpose,
    });

    await donation.save();

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save transaction" },
      { status: 500 }
    );
  }
}
