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

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Globe className="h-7 w-7 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                EcoRevive
              </span>
              <span className="text-[10px] text-gray-500 -mt-1">
                Sustaining Tomorrow
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6 font-medium">

            <Link href="/" className="hover:text-green-600">
              Home
            </Link>

            <Link href="/report" className="hover:text-green-600">
              Report Waste
            </Link>

            {/* Reward Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRewardDropdown(!rewardDropdown)}
                className="flex items-center gap-1 hover:text-green-600"
              >
                Reward <ChevronDown className="h-4 w-4" />
              </button>

              {rewardDropdown && (
                <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                  <Link
                    href="/leaderboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Leaderboard
                  </Link>

                  <Link
                    href="/reward"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Reward
                  </Link>
                </div>
              )}
            </div>

            <Link href="/plantation-donation" className="hover:text-green-600">
              Plantation
            </Link>

            <Link href="/events" className="hover:text-green-600">
              Events
            </Link>

            <Link href="/instructions" className="hover:text-green-600">
              Instructions
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* Reward Points */}
            {user && !loading && reward && (
              <div className="hidden sm:flex items-center gap-2 text-yellow-500 font-medium text-sm">
                <FaCoins />
                <span>{reward.points} pts</span>
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <Link
                  href="/dashboard"
                  className="text-sm hover:text-green-600"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden md:flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">

            <Link
              href="/"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/report"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Report Waste
            </Link>

            <Link
              href="/leaderboard"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>

            <Link
              href="/reward"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reward
            </Link>

            <Link
              href="/plantation-donation"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plantation
            </Link>

            <Link
              href="/events"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>

            <Link
              href="/instructions"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Instructions
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="block py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="block bg-green-500 text-white px-4 py-2 rounded-full text-center"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;