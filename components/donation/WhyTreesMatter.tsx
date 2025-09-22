"use client";
import { FaLeaf, FaWater, FaWind, FaTree } from "react-icons/fa";

const benefits = [
  { icon: <FaLeaf className="text-green-500 w-6 h-6" />, text: "Absorbs CO₂ and reduces climate change impact" },
  { icon: <FaTree className="text-emerald-600 w-6 h-6" />, text: "Supports biodiversity and wildlife" },
  { icon: <FaWater className="text-blue-400 w-6 h-6" />, text: "Prevents soil erosion" },
  { icon: <FaWind className="text-gray-400 w-6 h-6" />, text: "Improves air and water quality" },
];

export default function WhyTreesMatter() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
    
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-green-200 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-16 w-80 h-80 bg-emerald-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
         <img
  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop"
  alt="Tree plantation"
  className="rounded-xl shadow-xl hover:scale-75 w-[500px] transition-transform duration-500"
/>
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            Why Trees Matter 🌍
          </h2>
          <ul className="space-y-4 text-lg text-gray-700">
            {benefits.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-green-100 transition-colors duration-300 shadow-sm"
              >
                <span>{point.icon}</span>
                <span className="flex-1">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
