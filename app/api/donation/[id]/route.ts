import { NextResponse } from "next/server";
import { Donation } from "@/database/models/donationSchema";
// import connectDB from "@/database/connectDB";
import dbConnect from "@/database/dbConfig";
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

  

    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Delete donation error:", err);
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 });
  }
}