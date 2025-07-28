import { NextResponse ,NextRequest} from "next/server";
import dbConnect from "@/database/dbConfig";
import { Transaction } from "@/database/models/transactionSchema";
import { User } from "@/database/models/userSchema";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    if (!clerkId) return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });

    await dbConnect();;
    const user = await User.findOne({ clerkId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (err) {
    console.error("Error fetching reward transactions:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

