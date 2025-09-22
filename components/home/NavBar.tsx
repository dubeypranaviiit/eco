"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { FaCoins, FaArrowRight } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useRewardPoints } from "@/hooks/useRewardPoints";

const Navbar = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rewardDropdown, setRewardDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clerkId = user?.id;
  const { reward, loading } = useRewardPoints(clerkId);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setRewardDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          <Link href="/" className="flex items-center mr-6">
            <Globe className="h-7 w-7 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-800">EcoRevive</span>
              <span className="text-[10px] text-gray-500 -mt-1">
                Sustaining Tomorrow
              </span>
            </div>
          </Link>

          
          <div className="hidden md:flex items-center space-x-8 text-xl font-medium">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/report" className="hover:text-green-600">Report Waste</Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRewardDropdown(!rewardDropdown)}
                className="flex items-center gap-1 hover:text-green-600"
              >
                Reward <ChevronDown className="h-4 w-4" />
              </button>
              {rewardDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                  <Link
                    href="/leaderboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setRewardDropdown(false)}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    href="/reward"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setRewardDropdown(false)}
                  >
                    Reward
                  </Link>
                </div>
              )}
            </div>

            <Link href="/plantation-donation" className="hover:text-green-600">Plantation</Link>
            <Link href="/contact" className="hover:text-green-600">Contact Us</Link>
            <Link href="/instructions" className="hover:text-green-600">Instruction</Link>
          </div>
          <div className="flex items-center gap-6">
            {user && !loading && reward && (
              <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm">
                <FaCoins className="text-base" />
                <span>{reward.points} pts</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-green-600"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
