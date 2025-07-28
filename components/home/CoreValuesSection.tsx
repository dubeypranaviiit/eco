import React from 'react';
import FeatureCard from '../FeatureCard';
import { Leaf, Coins, Users } from 'lucide-react';

const CoreValuesSection = () => {
  return (
    <section className="grid md:grid-cols-3 gap-10 mb-20">
      <FeatureCard
        icon={Leaf}
        title="Sustainable Action"
        description="Take tangible steps towards a greener future by actively reducing environmental waste."
      />
      <FeatureCard
        icon={Coins}
        title="Reward-Driven Impact"
        description="Earn meaningful rewards for every eco-friendly action you take in your community."
      />
      <FeatureCard
        icon={Users}
        title="Empowered Community"
        description="Join a movement of individuals working together to drive real change in waste management."
      />
    </section>
  );
};

export default CoreValuesSection;
