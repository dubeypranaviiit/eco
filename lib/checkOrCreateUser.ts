// lib/checkOrCreateUser.ts
import { currentUser } from "@clerk/nextjs/server"; // or "@clerk/nextjs" if client-side
// import { connectToDB } from "@/lib/mongoose";
import { User } from "@/database/models/userSchema";
import dbConnect from "@/database/dbConfig";
export async function checkOrCreateUserInDB() {
  const user = await currentUser(); // Clerk user
  if (!user) return null;

  const clerkId = user.id;
  const email = user.emailAddresses[0]?.emailAddress || "";
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  await dbConnect();

  let existingUser = await User.findOne({ clerkId });
  if (!existingUser) {
    existingUser = await User.create({ clerkId, email, name });
    console.log("✅ User created in DB:", existingUser);
  } else {
    console.log("🔁 User already exists in DB:", existingUser.email);
  }

  return existingUser;
}
