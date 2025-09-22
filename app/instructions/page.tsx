"use client";
import { useState } from "react";
import { Trash2, Recycle, Leaf, Skull, Info, MapPin, ChevronDown, ExternalLink } from "lucide-react";

const wasteGuide = [
    { 
      name: "Organic Waste", 
      description: "Biodegradable waste that decomposes naturally, including fruit and vegetable scraps, coffee grounds, eggshells, leaves, and garden trimmings. Properly managed, organic waste can be composted to create nutrient-rich soil, reducing landfill waste and greenhouse gas emissions.", 
      icon: <Leaf className="text-green-700 w-6 h-6" /> 
    },
    { 
      name: "Recyclable Waste", 
      description: "Materials that can be reprocessed and used again, such as plastic bottles, paper products, glass containers, and aluminum cans. Proper recycling reduces the consumption of raw materials, lowers energy use, and minimizes pollution, promoting a sustainable environment.", 
      icon: <Recycle className="text-blue-700 w-6 h-6" /> 
    },
    { 
      name: "Hazardous Waste", 
      description: "Waste that poses potential harm to human health and the environment, including expired medications, batteries, fluorescent bulbs, chemical cleaners, and e-waste like old computers and mobile phones. These items should be disposed of through designated hazardous waste programs to prevent soil and water contamination.", 
      icon: <Skull className="text-red-700 w-6 h-6" /> 
    }, 
    { 
      name: "General Waste", 
      description: "Non-recyclable and non-compostable waste, such as contaminated packaging, used tissues, disposable masks, Styrofoam, and mixed-material products. This type of waste typically ends up in landfills or incinerators, making waste reduction and mindful consumption essential to minimize environmental impact.", 
      icon: <Trash2 className="text-gray-700 w-6 h-6" /> 
    },
  ];
  

  const benefits = [
    { 
      title: "Environmental Benefits", 
      details: "Proper waste management plays a crucial role in protecting the environment. By reducing landfill waste, we prevent soil and water contamination caused by hazardous materials seeping into the ground. Recycling conserves natural resources such as trees, water, and minerals, reducing the need for excessive extraction and deforestation. Additionally, waste reduction helps lower greenhouse gas emissions from landfills, decreasing air pollution and mitigating climate change. A cleaner environment supports biodiversity, ensuring healthier ecosystems for future generations."
    },
    { 
      title: "Economic Benefits", 
      details: "Effective waste management contributes significantly to economic growth and sustainability. Recycling industries generate employment opportunities in collection, processing, and manufacturing sectors. Businesses and municipalities save money by reducing landfill expenses and finding innovative ways to repurpose materials. The circular economy, which emphasizes reusing and recycling, leads to increased efficiency and cost savings for industries. Additionally, waste-to-energy technologies transform certain waste materials into renewable energy, providing an alternative source of power and reducing reliance on fossil fuels."
    },
    { 
      title: "Social Benefits", 
      details: "Proper waste disposal and recycling improve public health by minimizing exposure to harmful toxins and pollutants. Clean surroundings reduce the spread of diseases, benefiting communities by creating a healthier living environment. Promoting sustainable waste management encourages responsible behavior, educating people about their impact on the planet. Additionally, repurposing and donating usable items like clothing, furniture, and electronics help those in need, fostering a sense of social responsibility and community support. By making conscious choices about waste, society as a whole moves towards a more sustainable and equitable future."
    },
  ];
  
const resources = [
  { name: "UNEP – Waste & Recycling", link: "https://www.unep.org/explore-topics/resource-efficiency/what-we-do/sustainable-lifestyles/waste-recycling" },
  { name: "National Geographic – Waste Crisis", link: "https://www.nationalgeographic.com/environment/article/critical-issues-waste" },
  { name: "EPA – Reduce, Reuse, Recycle", link: "https://www.epa.gov/recycle" },
  { name: "Ellen MacArthur Foundation – Circular Economy", link: "https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview" },
];

export default function InstructionsPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        Waste Disposal Instructions
      </h1>

   
      <section className="mb-8 bg-green-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center">
          <Info className="w-5 h-5 text-blue-500 mr-2" />
          Why Proper Waste Disposal is Important
        </h2>
        <p className="text-gray-700 mt-2">
          Proper waste disposal helps keep our environment clean, prevents pollution, and conserves resources.
        </p>
      </section>

      <section className="space-y-6">
        {wasteGuide.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
            {item.icon}
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

    
      <section className="mt-8">
        <h2 className="text-xl font-semibold flex items-center">
          <Trash2 className="w-5 h-5 text-green-700 mr-2" />
          Benefits of Proper Waste Separation
        </h2>
        <div className="mt-4 space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-sm">
              <button
                className="w-full p-4 flex justify-between items-center"
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              >
                <span className="text-lg font-medium">{benefit.title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openAccordion === index ? "rotate-180" : ""}`} />
              </button>
              {openAccordion === index && (
                <p className="p-4 text-gray-600 border-t border-gray-200">{benefit.details}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-purple-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center">
          <MapPin className="w-5 h-5 text-purple-500 mr-2" />
          Local Waste Collection & Drop-off Points
        </h2>
        <p className="text-gray-700 mt-2">
          Find your nearest waste disposal center or recycling drop-off location using the city’s official website.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold flex items-center">
          <ExternalLink className="w-5 h-5 text-blue-500 mr-2" />
          Learn More About Waste Management
        </h2>
        <ul className="mt-4 space-y-3">
          {resources.map((resource, index) => (
            <li key={index} className="flex items-center">
              <ExternalLink className="w-4 h-4 text-gray-500 mr-2" />
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
