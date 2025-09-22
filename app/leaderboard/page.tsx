"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type LeaderboardEntry = {
  rank: number;
  name: string;
  points: number;
  wasteRecycled: string;
  impact: string;
  badge: string;
};

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard");
        const data = res.data;
        if (data.success) {
          setLeaderboardData(data.data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">EcoRevive Leaderboard</h1>
        <p className="text-lg text-gray-600">Recognizing our top contributors in environmental conservation</p>
      </div>

      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 gap-5 sm:grid-cols-4">
        {[{ title: "Total Participants", value: "500+" }, { title: "Total Waste Recycled", value: "25,000 kg" }, { title: "CO₂ Reduced", value: "50,000 kg" }, { title: "Active Communities", value: "50" }].map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stat.value}</dd>
            </div>
          </div>
        ))}
      </div>
   

      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Rank", "User", "Points", "Rewards", "Impact", "Badge"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : leaderboardData.length > 0 ? (
                leaderboardData.map((entry, index) => (
                  <tr
                    key={index}
                    className={index < 3 ? "bg-green-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      #{entry.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.wasteRecycled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.impact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            entry.badge === "Platinum"
                              ? "bg-purple-100 text-purple-800"
                              : entry.badge === "Gold"
                              ? "bg-yellow-100 text-yellow-800"
                              : entry.badge === "Silver"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        `}
                      >
                        {entry.badge}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No rewards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">Want to see your organization on the leaderboard?</p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Join EcoRevive Network
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
