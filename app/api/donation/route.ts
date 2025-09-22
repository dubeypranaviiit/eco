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


export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId is required" },
        { status: 400 }
      );
    }

    const donations = await Donation.find({ clerkId }).sort({ createdAt: -1 });
    return NextResponse.json(donations, { status: 200 });
  } catch (err) {
    console.error("Error fetching donations:", err);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
