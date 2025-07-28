"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function UserSyncer() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !user) return;

      try {
        const res = await axios.post("/api/user", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        });

        console.log("User synced:", res.data);
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    };

    syncUser();
  }, [user, isSignedIn]);

  return null;
}
