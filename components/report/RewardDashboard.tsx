"use client";

import { useEffect, useState } from "react";
import { useRewards } from "@/context/RewardContext"; 
import { useUser } from "@clerk/nextjs"; 

const  RewardDashboard=()=> {
  const { rewards, loading, fetchRewards } = useRewards();
  const { user } = useUser();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availability, setAvailability] = useState<string>("all");

  useEffect(() => {
    if (user?.id) {
      fetchRewards(user.id); 
    }
  }, [user]);

 
  const filteredRewards = rewards.filter((reward) => {
    const rewardDate = new Date(reward.createdAt).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    if (start && rewardDate < start) return false;
    if (end && rewardDate > end) return false;

    if (availability === "available" && !reward.isAvailable) return false;
    if (availability === "unavailable" && reward.isAvailable) return false;

    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Rewards</h1>

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* 🔹 Rewards Table */}
      {loading ? (
        <p className="text-gray-500">Loading rewards...</p>
      ) : filteredRewards.length === 0 ? (
        <p className="text-gray-500">No rewards found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Points</th>
                <th className="p-3 border">Level</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Collection Info</th>
                <th className="p-3 border">Created At</th>
            
              </tr>
            </thead>
            <tbody>
              {filteredRewards.map((reward) => (
                <tr key={reward._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{reward.name}</td>
                  <td className="p-3 border">{reward.points}</td>
                  <td className="p-3 border">{reward.level}</td>
                  <td className="p-3 border">
                    {reward.isAvailable ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-3 border">{reward.description || "-"}</td>
                  <td className="p-3 border">{reward.collectionInfo}</td>
                  <td className="p-3 border">
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default RewardDashboard;