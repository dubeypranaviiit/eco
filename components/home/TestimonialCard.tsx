"use client"
import React, { useState } from "react";

type Testimonial = {
  userImage: string;
  userName: string;
  userLocation: string;
  testimonialText: string;
  serviceUsed: string;
  rating: number;
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const {
    userImage,
    userName,
    userLocation,
    testimonialText,
    serviceUsed,
    rating,
  } = testimonial;

  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-2xl shadow-md border p-6 max-w-sm bg-white">
      <img
        src={
          imageError
            ? "https://via.placeholder.com/150" 
            : userImage
        }
        onError={() => setImageError(true)}
        alt={userName}
        className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
      />
      <h3 className="text-lg font-semibold text-center">{userName}</h3>
      <p className="text-sm text-gray-500 text-center">{userLocation}</p>
      <p className="text-gray-700 my-3 text-center italic">“{testimonialText}”</p>
      <p className="text-sm text-gray-600 text-center mb-2">
        Service Used: <span className="font-medium">{serviceUsed}</span>
      </p>
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
