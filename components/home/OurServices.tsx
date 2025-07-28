"use client";

import React from "react";
import { FaTrash, FaTruck, FaRecycle, FaSkull } from "react-icons/fa";


interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: <FaTrash className="text-4xl" />,
    title: "Residential Waste",
    description: "Regular collection services for households",
  },
  {
    icon: <FaTruck className="text-4xl" />,
    title: "Commercial Waste",
    description: "Customized solutions for businesses",
  },
  {
    icon: <FaRecycle className="text-4xl" />,
    title: "Recycling Services",
    description: "Sustainable recycling programs",
  },
  {
    icon: <FaSkull className="text-4xl" />,
    title: "Hazardous Waste",
    description: "Safe disposal of dangerous materials",
  },
];

const OurServices: React.FC = () => {
  return (
    <section id="service" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300"
            >
              <div className="text-green-500 mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
