import React, { useRef } from "react";
import DonationForm from "./DonationForm";
interface HeroProps {
  onDonateClick: () => void;
}
const ClosingCTA: React.FC<HeroProps> = ({ onDonateClick }) =>{ 

  return (
    <section className="py-20 bg-green-600 text-white text-center">
      <h2 className="text-4xl font-bold mb-4">
        Together, We Can Plant 10,000 Trees per year 🌍
      </h2>
      <p className="text-lg mb-6">
        Be part of the change — every contribution makes a difference.
      </p>
      <button
        onClick={onDonateClick}  
        className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        Donate Now
      </button>
    </section>
  );
}
export default ClosingCTA;
