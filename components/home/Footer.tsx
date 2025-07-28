"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white w-full py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About EcoRevive</h3>
            <p className="text-gray-400">
              Leading waste management solutions for a sustainable future.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
            Booty More
              <br />
           Ranchi,Jharkhand
              <br />
              contact@ecorevive.com
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-full w-full"
              />
              <button className="bg-green-500 px-6 py-2 rounded-r-full hover:bg-green-600 transition">
                Subscribe
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link href="https://facebook.com" target="_blank" className="hover:text-green-500">
                <FaFacebookF />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-green-500">
                <FaTwitter />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="hover:text-green-500">
                <FaInstagram />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-green-500">
                <FaLinkedinIn />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} EcoRevive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
