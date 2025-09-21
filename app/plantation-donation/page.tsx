"use client";
import React, { useState ,useRef} from "react";
import Hero from "@/components/donation/Hero";
import ImpactStatsSection from "@/components/donation/Impacts";
import DonationForm from "@/components/donation/DonationForm";
import ThankYouModal from "@/components/donation/ThankYouModal";
import WhyTreesMatter from "@/components/donation/WhyTreesMatter";
import DonationTransparency from "@/components/donation/DonationTransparency";
import ClosingCTA from "@/components/donation/ClosingCTA";
interface ImpactStats {
  treesPlanted: number;
  moneyRaised: number;
  co2Offset: number;
}

const DonationPage: React.FC = () => {
 const stats = {
    treesPlanted: 1200,
    moneyRaised: 85000,
    co2Offset: 5000,
  };
    const donationRef = useRef<HTMLDivElement>(null);

  const scrollToDonation = () => {
    donationRef.current?.scrollIntoView({ behavior: "smooth" });
  };
    const handleDonate = () => {
    setShowModal(true);
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-sage-100">
      <Hero onDonateClick={scrollToDonation}  />
      <ImpactStatsSection stats={stats} />
      <WhyTreesMatter />
      <DonationTransparency/>
       <div id="don" ref={donationRef}>
        <DonationForm onDonate={handleDonate} />
      </div>
      <ThankYouModal show={showModal} onClose={() => setShowModal(false)} />
        
        <ClosingCTA  onDonateClick={scrollToDonation}/>
    </div>
  );
};

export default DonationPage;
