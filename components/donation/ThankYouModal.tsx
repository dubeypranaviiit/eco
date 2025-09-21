

import React, { useState } from "react";
import axios from "axios";
import { FaTree, FaLeaf, FaHeart, FaDollarSign } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ThankYouModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Thank You!</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Your donation will help us plant more trees and create a better future 🌍
        </p>
        <div className="flex justify-center">
          <FaHeart className="text-6xl text-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
export default ThankYouModal;