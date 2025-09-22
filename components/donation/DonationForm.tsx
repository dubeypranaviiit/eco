"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useDonations } from "@/context/DonationContext";

interface DonationFormProps {
  onDonate?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onDonate }) => {
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const clerkId = user?.id;

  const { createDonation } = useDonations(); // Using context

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkId) {
      alert("You must be logged in to donate");
      return;
    }

    if (amount < 100) {
      alert("Minimum donation amount is ₹100");
      return;
    }

    setLoading(true);
    try {
      // Use context function instead of calling axios directly
      await createDonation(clerkId, amount);

      if (onDonate) onDonate();
    } catch (err) {
      console.error(err);
      alert("Payment failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="don" className="py-16 bg-white">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-emerald-600 mb-4">
          Plant a Tree, Plant Hope
        </h2>
        <p className="text-gray-700 mb-6">
          Your donation will help us plant trees and create a greener future 🌱
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-left font-semibold mb-1">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              value={amount || 100}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount (min ₹100)"
              min={100}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            {loading ? "Redirecting..." : "Donate Now"}
          </button>
        </form>

        <p className="mt-6 text-gray-500 text-sm">
          Powered by Stripe. Test payments are supported in development mode.
        </p>
      </div>
    </section>
  );
};

export default DonationForm;
