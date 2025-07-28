"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGlobe } from "../animation/animatedGlobe";

export default function TopBanner() {
  const { isSignedIn } = useUser();

  return (
    <section className="text-center mb-20 px-4">
      <AnimatedGlobe />

      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
        Powering the Future of{" "}
        <span className="text-green-600">Sustainable Living</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
        Join thousands of eco-warriors in making waste management smarter,
        cleaner, and rewarding.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        {isSignedIn ? (
          <Link href="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-8 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Report Waste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-8 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}

     
        <a href="#services"
          className="bg-green-600 hover:bg-green-700 text-white text-lg py-2.5 px-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Explore Services
          {/* <ArrowRight className="w-5 h-5" /> */}
        </a>
      </div>
    </section>
  );
}
