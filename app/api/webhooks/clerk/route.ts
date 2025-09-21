import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { User } from "@/database/models/userSchema";
import dbConnect from "@/database/dbConfig";
export async function POST(req: Request) {
    dbConnect();
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new NextResponse("Webhook secret missing", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id") as string;
  const svix_timestamp = headerPayload.get("svix-timestamp") as string;
  const svix_signature = headerPayload.get("svix-signature") as string;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    try {
     

      const existingUser = await User.findOne({ clerkId: data.id });

      if (!existingUser) {
        await User.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        });

        console.log(" New user saved to MongoDB");
      }
    } catch (error) {
      console.error("Error saving user to DB:", error);
      return new NextResponse("DB error", { status: 500 });
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
