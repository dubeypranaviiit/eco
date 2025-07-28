"use client";

import React, { useState, useEffect } from "react";
import {
  FaRecycle,
  FaLeaf,
  FaUsers,
  FaLightbulb,
  FaChartLine,
  FaHandHoldingHeart,
} from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface ImpactStat {
  label: string;
  value: number;
}

// interface Value {
//   icon: JSX.Element;
//   title: string;
//   desc: string;
// }
interface Value {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

const page = () => {
  const [animate, setAnimate] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Environmental advocate with 15+ years in sustainability",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      bio: "Expert in waste management and circular economy",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
    {
      name: "Emma Williams",
      role: "Sustainability Director",
      bio: "Specialized in environmental impact assessment",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    },
    {
      name: "David Miller",
      role: "Technology Lead",
      bio: "Innovator in recycling technologies",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    },
  ];

  const impactStats: ImpactStat[] = [
    { label: "Tons Recycled", value: 50000 },
    { label: "CO₂ Reduced", value: 25000 },
    { label: "Communities Served", value: 100 },
  ];

  const values: Value[] = [
    {
      icon: <FaRecycle />,
      title: "Circular Economy",
      desc: "Promoting sustainable resource use",
    },
    {
      icon: <FaLeaf />,
      title: "Environmental Stewardship",
      desc: "Protecting our planet",
    },
    {
      icon: <FaUsers />,
      title: "Community Focus",
      desc: "Building stronger communities",
    },
  ];

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="bg-gray-50">
  
      <div
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transforming Waste, Preserving Our Planet
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Leading the revolution in sustainable waste management and
            environmental conservation
          </p>
        </div>
      </div>

 
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At EcoRevive, we're committed to revolutionizing waste management
              through innovative solutions that protect our environment and
              create sustainable communities for future generations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[<FaLeaf />, <FaRecycle />, <FaUsers />, <FaLightbulb />].map(
              (Icon, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-4xl text-green-600 mb-4">{Icon}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>


      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold">{member.name}</h3>
                  <p className="text-green-400">{member.role}</p>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-green-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

   
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="text-4xl text-green-600 mb-4 flex justify-center">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8">
            Be part of the solution for a sustainable future
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300">
            Get Involved
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
