import React from 'react';
import ImpactCard from '../ImpactCard';
import { MapPin, Coins, Leaf, Recycle } from 'lucide-react';

const impactData = {
  wasteCollected: 1250,         
  reportsSubmitted: 342,
  tokensEarned: 1500,
  co2Offset: 875                
};

const OurImpact = () => {
  return (
    <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Impact</h2>
      <div className="grid md:grid-cols-4 gap-6">
        <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Recycle} />
        <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
        <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} />
        <ImpactCard title="CO2 Offset" value={`${impactData.co2Offset} kg`} icon={Leaf} />
      </div>
    </section>
  );
};

export default OurImpact;
