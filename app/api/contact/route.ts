import dbConnect from "@/database/dbConfig";
import {Contact} from "@/database/models/contactSchema";
import {User} from "@/database/models/userSchema";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { clerkId, fullName, email, phone, service, message } = body;

    if (!clerkId || !fullName || !email || !service || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
   const userId= await User.findOne({clerkId});
    const contact = await Contact.create({ userId, fullName, email, phone, service, message });

    return new Response(JSON.stringify({ success: true, contact }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}
