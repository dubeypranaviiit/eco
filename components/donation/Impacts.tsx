import React from "react";
import { FaTree, FaLeaf, FaDollarSign } from "react-icons/fa";


interface ImpactStats {
  treesPlanted: number;
  moneyRaised: number;
  co2Offset: number;
}

const ImpactStatsSection: React.FC<{ stats: ImpactStats }> = ({ stats }) => {
  return (
    <section id="impact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-emerald-600">
          Our Impact
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
      
          <div className="text-center p-6 rounded-lg bg-green-50 shadow hover:shadow-lg transition duration-300">
            <FaTree className="text-4xl text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.treesPlanted.toLocaleString()}
            </h3>
            <p className="text-gray-600">Trees Planted</p>
          </div>


          <div className="text-center p-6 rounded-lg bg-green-50 shadow hover:shadow-lg transition duration-300">
            <FaDollarSign className="text-4xl text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">
              ₹{stats.moneyRaised.toLocaleString()}
            </h3>
            <p className="text-gray-600">Funds Raised</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-green-50 shadow hover:shadow-lg transition duration-300">
            <FaLeaf className="text-4xl text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.co2Offset.toLocaleString()} kg
            </h3>
            <p className="text-gray-600">CO2 Offset</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStatsSection;
