"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
const DonationCancelPage = () => {
     const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 30000); 

    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">Sorry</h1>
      <p className="text-gray-700 mb-2">
       Please  try again later 
      </p>
     
      <div className="text-6xl text-green-500 animate-pulse">❤️</div>
      <p className="text-gray-400 mt-6">You will be redirected to the homepage shortly.</p>
    </div>
  );
};

export default DonationCancelPage;
