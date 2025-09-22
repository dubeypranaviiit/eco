"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";

export type Report = {
  _id: string;
  userId: string;
  location: string;
  wasteType: string;
  amount: string;
  imageUrl?: string;
  verificationResult?: any;
  status: "pending" | "approved";
  createdAt: string;
  collectorId?: string;
};

type ReportContextType = {
  reports: Report[];
  loading: boolean;
  fetchReports: (clerkId: string) => Promise<void>;
  createReport: (clerkId: string, reportData: Partial<Report>) => Promise<void>;
  updateReportStatus: (
    reportId: string,
    status: "pending" | "approved"
  ) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);


  const fetchReports = async (clerkId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/report?clerkId=${clerkId}`);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };


  const createReport = async (
    clerkId: string,
    reportData: Partial<Report>
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/report", { clerkId, ...reportData });
      setReports((prev) => [data, ...prev]); 
    } catch (err) {
      console.error("Error creating report", err);
      alert("Failed to create report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (
    reportId: string,
    status: "pending" | "approved"
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/report/${reportId}`, { status });
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: data.status } : r))
      );
    } catch (err) {
      console.error("Error updating report status", err);
      alert("Failed to update report. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const deleteReport = async (reportId: string) => {
    setLoading(true);
    try {
      console.log(`Report id:${reportId}`);
      await axios.delete(`/api/report/${reportId}`);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      console.error("Error deleting report", err);
      alert("Failed to delete report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        fetchReports,
        createReport,
        updateReportStatus,
        deleteReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used inside ReportProvider");
  return ctx;
};
