"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";

export type Reward = {
  _id: string;
  userId: string;
  points: number;
  level: number;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  description?: string;
  name: string;
  collectionInfo: string;
};

type RewardContextType = {
  rewards: Reward[];
  loading: boolean;
  fetchRewards: (clerkId: string) => Promise<void>;
};

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

 
  const fetchRewards = async (clerkId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/reward?clerkId=${clerkId}`);
      setRewards(data);
    } catch (err) {
      console.error("Error fetching rewards", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RewardContext.Provider value={{ rewards, loading, fetchRewards }}>
      {children}
    </RewardContext.Provider>
  );
};

export const useRewards = () => {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error("useRewards must be used inside RewardProvider");
  return ctx;
};
