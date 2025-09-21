"use client";
import React, { useRef } from "react";
import DonationForm from "./DonationForm";



interface HeroProps {
  onDonateClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDonateClick }) =>{ 
 

    return(
  <section
    id="home"
    className="pt-24 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-32 relative overflow-hidden"
  >
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-400 opacity-20 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400 opacity-20 rounded-full blur-3xl"></div>

    <h1 className="text-5xl font-extrabold mb-6">Plant a Tree, Plant Hope</h1>
    <p className="text-xl mb-8 max-w-xl mx-auto">
      Join us in creating a greener future for generations to come 🌱
    </p>
    <button
        onClick={onDonateClick}  
      className="bg-white text-emerald-700 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-green-100 hover:scale-105"
    >
      Donate Now
    </button>
  </section>
)
};
export default Hero;