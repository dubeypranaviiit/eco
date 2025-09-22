// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";
// interface Donation {
//   amount: number;
//   paymentId: string;
//   status: "pending" | "success";
// }
// const DonationSuccessPage = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const sessionId = searchParams.get("session_id");
//   const [donation, setDonation] = useState<Donation | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!sessionId) return;

//     let interval: number;

//     const fetchDonationStatus = async () => {
//       try {
       
//         const stripeRes = await axios.get(`/api/checkout-session?sessionId=${sessionId}`);
//         const data: Donation = { ...stripeRes.data, status: "pending" };
//         console.log(stripeRes.data.payment_status);
//         if (stripeRes.data.payment_status === "paid") {
//           data.status = "success";
//           await axios.post("/api/donations/update-status", {
//             paymentId: sessionId,
//             status: "success",
//           });
//         }

//         setDonation(data);
//         if (data.status === "success") clearInterval(interval);
//       } catch (err) {
//         console.error("Failed to fetch/update donation:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonationStatus();
//     interval = window.setInterval(fetchDonationStatus, 3000); 

//     const timer = setTimeout(() => router.push("/"), 60000); 

//     return () => {
//       clearInterval(interval);
//       clearTimeout(timer);
//     };
//   }, [sessionId, router]);

//   if (loading) return <p className="text-center mt-20">Loading donation status...</p>;
//   if (!donation) return <p className="text-center mt-20 text-red-500">Donation not found.</p>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
//       <h1 className="text-4xl font-bold text-emerald-700 mb-4">Thank You!</h1>
//       <p className="text-gray-700 mb-2">
//         Your donation of <strong>₹{donation.amount}</strong> success.
//       </p>
//       <p className="text-gray-500 mb-6">
//         Payment ID: <span className="font-mono">{donation.paymentId}</span>
//       </p>
//       <div className="text-6xl text-green-500 animate-pulse">❤️</div>
//       <p className="text-gray-400 mt-6">You will be redirected to the homepage shortly.</p>
//     </div>
//   );
// };

// export default DonationSuccessPage;
"use client";

import { Suspense } from "react";
import DonationSuccessContent from "./DonationSuccessContent";

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading donation page...</p>}>
      <DonationSuccessContent />
    </Suspense>
  );
}

