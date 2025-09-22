// /app/api/donations/update-status/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { Donation } from "@/database/models/donationSchema";

export async function POST(req: Request) {
  await dbConnect();
  const { paymentId, status } = await req.json();

  if (!paymentId || !status) {
    return NextResponse.json({ error: "Missing paymentId or status" }, { status: 400 });
  }

  try {
    const donation = await Donation.findOneAndUpdate(
      { paymentId },
      { status },
      { new: true }
    );

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, donation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
  }
}
