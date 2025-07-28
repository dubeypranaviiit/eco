import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@/database/models/userSchema";
import dbConnect from "@/database/dbConfig";
interface UserRequestBody {
  clerkId: string;
  email?: string;
  name?: string;
}
export async function GET(req: Request) {
  await dbConnect();
  const clerkId = req.headers.get("x-clerk-id");

  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { clerkId, email, name } = (await req.json()) as UserRequestBody;
    if (!clerkId || !email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email, name });
      await user.save();
      return NextResponse.json(user, { status: 201 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { clerkId, email, name } = (await req.json()) as UserRequestBody;

    if (!clerkId) {
      return NextResponse.json({ error: "clerkId required" }, { status: 400 });
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const clerk = await clerkClient();
    await clerk.users.updateUser(clerkId, {
      firstName: name?.split(" ")[0] || undefined,
      lastName: name?.split(" ")[1] || undefined,
     
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}