"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
    redirectTo: string;
}

const Banner: React.FC<BannerProps> = ({
  title = "Ready to Make a Difference?",
  subtitle = "Join us in creating a sustainable future through responsible waste management.",
  buttonText = "Get Started Today",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/sign-in"); 
  };

  return (
    <section className="py-20  bg-green-500 text-white">
      <div className="container mx-auto px-4 text-center mt-10">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8">{subtitle}</p>
        <button
          onClick={handleClick}
          className="bg-white text-green-500 px-8 py-3 rounded-full hover:bg-gray-100 transition"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Banner;
