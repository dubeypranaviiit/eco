"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/context/ReportContext"; 
import { useUser } from "@clerk/nextjs";

const ReportDashboard = () => {
  const {
    reports,
    fetchReports,
    updateReportStatus,
    deleteReport,
    loading,
  } = useReports();

  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedReport, setSelectedReport] = useState<any>(null);
   const {user}=useUser();
  const clerkId = user?.id as string;
  useEffect(() => {
    fetchReports(clerkId);
  }, [clerkId]);

 
  const filteredReports = reports.filter((r) => {
    let ok = true;
    if (status && r.status !== status) ok = false;
    if (dateRange.start && new Date(r.createdAt) < new Date(dateRange.start))
      ok = false;
    if (dateRange.end && new Date(r.createdAt) > new Date(dateRange.end))
      ok = false;
    return ok;
  });

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <input
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, start: e.target.value }))
          }
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, end: e.target.value }))
          }
          className="border p-2 rounded"
        />
      </div>

 
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Waste Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r) => (
              <tr
                key={r._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedReport(r)}
              >
                <td className="p-2 border">{r.location}</td>
                <td className="p-2 border">{r.wasteType}</td>
                <td className="p-2 border">{r.amount}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

   
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-3">Report Details</h2>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {selectedReport.location}
            </p>
            <p>
              <span className="font-semibold">Waste Type:</span>{" "}
              {selectedReport.wasteType}
            </p>
            <p>
              <span className="font-semibold">Amount:</span>{" "}
              {selectedReport.amount}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {selectedReport.status}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedReport.createdAt).toLocaleString()}
            </p>

            {selectedReport.imageUrl && (
              <img
                src={selectedReport.imageUrl}
                alt="Report"
                className="mt-3 rounded-lg max-h-60"
              />
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            
              <button
                onClick={() => deleteReport(selectedReport._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;
