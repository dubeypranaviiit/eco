"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const DonationSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [donation, setDonation] = useState<{ amount: number; paymentId: string } | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Fetch session details from backend
      axios
        .get(`/api/checkout-session?sessionId=${sessionId}`)
        .then((res) => setDonation(res.data))
        .catch((err) => console.error("Failed to fetch session:", err));
    }

    // Redirect to main page after 1 minute
    const timer = setTimeout(() => router.push("/"), 60000);
    return () => clearTimeout(timer);
  }, [sessionId, router]);

  if (!donation) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">Thank You!</h1>
      <p className="text-gray-700 mb-2">
        Your donation of <strong>₹{donation.amount}</strong> was successful.
      </p>
      <p className="text-gray-500 mb-6">Payment ID: <span className="font-mono">{donation.paymentId}</span></p>
      <div className="text-6xl text-green-500 animate-pulse">❤️</div>
      <p className="text-gray-400 mt-6">You will be redirected to the homepage shortly.</p>
    </div>
  );
};

export default DonationSuccessPage;
