"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
interface UserData {
  clerkId: string;
  name: string;
  email: string;
  createdAt?: string;
  walletBalance?: number;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  createUser: (data: Partial<UserData>) => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const refreshUser = async () => {
    if (!isLoaded || !user) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/user", {
        headers: { "x-clerk-id": user.id },
      });
      setUserData(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
       
        await createUser({
          clerkId: user.id,
          email:
            user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses[0]?.emailAddress ||
            "",
          name:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "New User",
        });
      } else {
        console.error(" Fetch user failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (data: Partial<UserData>) => {
    try {
      const res = await axios.post("/api/user", data);
      setUserData(res.data);
    } catch (err) {
      console.error(" Create user error:", err);
    }
  };


  const updateUser = async (data: Partial<UserData>) => {
    if (!userData) return;
    try {
      const res = await axios.put("/api/user", {
        clerkId: userData.clerkId,
        ...data,
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Update user error:", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [isLoaded, user]);

  return (
    <UserContext.Provider
      value={{ userData, loading, createUser, updateUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider");
  return ctx;
};
