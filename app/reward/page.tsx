"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface RewardTransaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface RewardSummary {
  points: number;
  level: number;
  name: string;
  collectionInfo: string;
  createdAt: string;
}

const RewardPage = () => {
  const { user } = useUser();
  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRewards = async () => {
      try {
        const [summaryRes, txnRes] = await Promise.all([
          axios.get(`/api/reward/points?clerkId=${user.id}`),
          axios.get(`/api/reward/transactions?clerkId=${user.id}`),
        ]);

        setSummary(summaryRes.data);
        setTransactions(txnRes.data);
      } catch (err) {
        console.error("Error fetching rewards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  if (loading) return <div className="p-6 text-center">Loading rewards...</div>;
  if (!summary) return <div className="p-6 text-center text-red-500">No reward data found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-green-700">My Rewards</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <p className="text-lg font-semibold text-gray-700">
          Total Points: <span className="text-green-600 font-bold">{summary.points}</span>
        </p>
        <p className="text-gray-600">Level: {summary.level}</p>
        <p className="text-gray-600">Reward: {summary.name}</p>
        <p className="text-gray-500 text-sm mt-2">
          Collection Info: {summary.collectionInfo}
        </p>
        <p className="text-gray-400 text-xs">Created at: {new Date(summary.createdAt).toLocaleString()}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Reward Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-600 text-white text-left">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 text-sm capitalize">{txn.type}</td>
                <td className="py-2 px-4 text-sm text-green-700 font-semibold">+{txn.amount}</td>
                <td className="py-2 px-4 text-sm">{txn.description}</td>
                <td className="py-2 px-4 text-sm">{new Date(txn.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardPage;
