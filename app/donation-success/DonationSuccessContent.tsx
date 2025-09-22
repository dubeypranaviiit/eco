"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

interface Donation {
  amount: number;
  paymentId: string;
  status: "pending" | "success";
}

export default function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ If sessionId missing, redirect immediately
  useEffect(() => {
    if (!sessionId) {
      router.replace("/"); // go back home instantly
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId) return;

    let interval: ReturnType<typeof setInterval>;
    let timer: ReturnType<typeof setTimeout>;

    const fetchDonationStatus = async () => {
      try {
        const stripeRes = await axios.get(`/api/checkout-session?sessionId=${sessionId}`);
        const data: Donation = {
          amount: stripeRes.data.amount,
          paymentId: stripeRes.data.id,
          status: stripeRes.data.payment_status === "paid" ? "success" : "pending",
        };

        if (data.status === "success") {
          await axios.post("/api/donations/update-status", {
            paymentId: sessionId,
            status: "success",
          });
          clearInterval(interval);
        }

        setDonation(data);
      } catch (err) {
        console.error("Failed to fetch/update donation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationStatus();
    interval = setInterval(fetchDonationStatus, 3000);

    // ✅ Auto-redirect after 60s
    timer = setTimeout(() => router.push("/"), 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [sessionId, router]);

  if (loading) return <p className="text-center mt-20">Loading donation status...</p>;
  if (!donation) return <p className="text-center mt-20 text-red-500">Donation not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">Thank You!</h1>
      <p className="text-gray-700 mb-2">
        Your donation of <strong>₹{donation.amount}</strong> was successful.
      </p>
      <p className="text-gray-500 mb-6">
        Payment ID: <span className="font-mono">{donation.paymentId}</span>
      </p>
      <div className="text-6xl text-green-500 animate-pulse">❤️</div>
      <p className="text-gray-400 mt-6">
        You will be redirected to the homepage shortly.
      </p>

      {/* Optional: Give user a manual redirect button */}
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
      >
        Go to Homepage Now
      </button>
    </div>
  );
}
