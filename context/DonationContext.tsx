"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";

export type Donation = {
  _id: string;
  clerkId: string;
  amount: number;
  currency: string;
  paymentId: string;
  sessionId?: string;
  status: "pending" | "success" | "failed" | "refunded";
  purpose?: string;
  createdAt: string;
};

type DonationContextType = {
  donations: Donation[];
  loading: boolean;
  fetchDonations: (clerkId: string) => Promise<void>;
  createDonation: (clerkId: string, amount: number) => Promise<void>;
  deleteDonation: (donationId: string) => Promise<void>; // ⬅️ added
};

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider = ({ children }: { children: React.ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);


  const fetchDonations = async (clerkId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/donation?clerkId=${clerkId}`);
      setDonations(data);
      console.log("Fetched donations:", data);
    } catch (err) {
      console.error("Error fetching donations", err);
    } finally {
      setLoading(false);
    }
  };

  
  const createDonation = async (clerkId: string, amount: number) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/create-checkout-session", { clerkId, amount });
      if (data.success && data.order) {
        const order = data.order;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: order.amount,
          currency: order.currency,
          name: "EcoRevive",
          description: "Tree Plantation Donation",
          order_id: order.id,
          handler: async function (response: any) {
            try {
              const verifyRes = await axios.post("/api/verify-payment", {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                window.location.href = `/donation-success?session_id=${order.id}`;
              } else {
                alert("Payment verification failed");
              }
            } catch (err) {
              console.error("Payment verification request failed:", err);
              alert("Payment verification request failed. Please contact support.");
            }
          },
          theme: {
            color: "#059669",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error(data.error || "Failed to create payment session");
      }
    } catch (err: any) {
      console.error("Error creating donation", err);
      alert(err.message || "Failed to create donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const deleteDonation = async (donationId: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/donation/${donationId}`);
      setDonations((prev) => prev.filter((d) => d._id !== donationId));
    } catch (err) {
      console.error("Error deleting donation", err);
      alert("Failed to delete donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DonationContext.Provider
      value={{ donations, loading, fetchDonations, createDonation, deleteDonation }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonations must be used inside DonationProvider");
  return ctx;
};
