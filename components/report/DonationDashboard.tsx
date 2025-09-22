"use client";
import { useEffect, useState } from "react";
import { useDonations } from "@/context/DonationContext"; 
import { useUser } from "@clerk/nextjs";

 const DonationDashboard=()=> {
  const { donations, loading, fetchDonations, deleteDonation } = useDonations();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
   const {user}=useUser();
    const clerkId = user?.id as string;
  
  useEffect(() => {
    fetchDonations(clerkId);
  }, [clerkId]);


  const filteredDonations = donations.filter((donation) => {
    const donationDate = new Date(donation.createdAt).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    if (start && donationDate < start) return false;
    if (end && donationDate > end) return false;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Donations</h1>

   
      <div className="flex gap-4 mb-6">
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
      </div>

      {loading ? (
        <p className="text-gray-500">Loading donations...</p>
      ) : filteredDonations.length === 0 ? (
        <p className="text-gray-500">No donations found in this range.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Currency</th>
                <th className="p-3 border">Payment ID</th>
                <th className="p-3 border">Purpose</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
             
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{donation.amount}</td>
                  <td className="p-3 border">{donation.currency}</td>
                  <td className="p-3 border">{donation.paymentId}</td>
                  <td className="p-3 border">{donation.purpose || "-"}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        donation.status === "success"
                          ? "bg-green-500"
                          : donation.status === "pending"
                          ? "bg-yellow-500"
                          : donation.status === "failed"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {new Date(donation.createdAt).toLocaleDateString()}
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
export default DonationDashboard;