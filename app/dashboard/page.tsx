"use client";

import { useState } from "react";
import DonationDashboard from "@/components/report/DonationDashboard";
import ReportDashboard from "@/components/report/ReportDashboard";
import RewardDashboard from "@/components/report/RewardDashboard";
import UserProfile from "@/components/UserProfile";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"report" | "donation" | "reward">(
    "report"
  );

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <UserProfile />
      <div className="flex justify-center  items-center gap-4 mt-6 mb-6">
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "report"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab("donation")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "donation"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Donations
        </button>
        <button
          onClick={() => setActiveTab("reward")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "reward"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Rewards
        </button>
      </div>

     
      <div>
        {activeTab === "report" && <ReportDashboard />}
        {activeTab === "donation" && <DonationDashboard />}
        {activeTab === "reward" && <RewardDashboard />}
      </div>
    </div>
  );
};

export default Page;
