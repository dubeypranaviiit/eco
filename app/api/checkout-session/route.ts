import { NextResponse } from "next/server";
import { Donation } from "@/database/models/donationSchema";
import dbConnect from "@/database/dbConfig";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    await dbConnect();

    const donation = await Donation.findOne({
      $or: [
        { orderId: sessionId },
        { paymentId: sessionId }
      ]
    });

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({
      amount: donation.amount,
      paymentId: donation.paymentId,
      status: donation.status,
    });
  } catch (err: any) {
    console.error("Failed to retrieve donation:", err);
    return NextResponse.json({ error: err.message || "Failed to retrieve donation" }, { status: 500 });
  }
}
