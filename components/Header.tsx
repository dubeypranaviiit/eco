"use client";

import React from "react";
import { Globe, Menu, Coins, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings?: number;
}

const Header = ({ onMenuClick, totalEarnings = 0 }: HeaderProps) => {
  const { isSignedIn } = useUser();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-10 py-2 h-14">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Sidebar Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="text-green-500 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />

            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm sm:text-base md:text-lg">
                EcoRevive
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500">
                Sustaining Tomorrow
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER SEARCH (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search reports, users..."
              className="w-full pl-4 pr-10 py-2 text-sm border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Balance */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 sm:px-3 py-1">
            <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-1" />

            <span className="text-xs sm:text-sm font-semibold">
              {totalEarnings.toFixed(2)}
            </span>
          </div>

          {/* Clerk User */}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </header>
  );
};

export default Header;