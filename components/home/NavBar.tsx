// "use client";

// import Link from "next/link";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { FaCoins } from "react-icons/fa";
// import { FaArrowRight } from "react-icons/fa";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { Globe } from "lucide-react";
// import { useRewardPoints } from "@/hooks/useRewardPoints";
// const Navbar = () => {
//   const { user } = useUser();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//  const clerkId = user?.id;
//   const { reward, loading } = useRewardPoints(clerkId);
//   return (
//     <nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50 ">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//                    <Link href="/" className="flex items-center mr-7 ml-0 ">
//                    <Globe className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
//                   <div className="flex flex-col">
//                     <span className="font-bold text-base md:text-lg text-gray-800">EcoRevive</span>
//                     <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">Sustaining Tomorrow</span>
//                   </div>
//                 </Link>

//           <div className="hidden md:flex space-x-8 items-center text-xl">
//             <Link href="/" className="hover:text-green-600 font-medium">Home</Link>
//              <Link href="/report" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Report Waste</Link>
//             <div className="relative group">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="hover:text-green-600 font-medium"
//               >
//              Reward
//               </button>
//               <div className={`absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 ${dropdownOpen ? "block" : "hidden"} group-hover:block`}>
//                 <Link href="/leaderboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Leaderboard</Link>
//                 <Link href="/reward" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Reward</Link>
//               </div>
//             </div>
//            <Link href="/user" className="flex items-center mr-7 ml-0 ">User</Link>
//             <Link href="/instructions" className="hover:text-green-600 font-medium">Instruction</Link>

          
//           </div>
//             {user ? (
//               <UserButton afterSignOutUrl="/" />
//             ) : (
//               <Link href="/sign-in" className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
//                 Get Started <FaArrowRight className="ml-2" />
//               </Link>
//             )}
//               <div className="w-full px-4 py-2 bg-[#0a0a23] flex justify-end items-center space-x-4 text-white shadow">
//       {reward.points !== null && (
//         <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
//           <FaCoins className="text-base" />
//           {reward.points} pts
//         </div>
//       )}
//       <UserButton afterSignOutUrl="/" />
//     </div>
//   );

        
//           <div className="md:hidden">
//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//               {mobileMenuOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>

       
//         {mobileMenuOpen && (
//           <div className="md:hidden mt-2 space-y-2 px-2 pb-4">
//             <Link href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Home</Link>
//             <Link href="/report" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Report Waste</Link>
//             <div className="space-y-1">
//               <p className="px-4 font-medium text-gray-700 dark:text-gray-200"> Reward</p>
//               <Link href="/leaderboard" className="block px-6 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Leaderboard</Link>
//               <Link href="/reward" className="block px-6 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Reward</Link>
//             </div>
//             <Link href="/instruction" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Instruction</Link>
//             {user ? (
//               <UserButton afterSignOutUrl="/" />
//             ) : (
//               <Link href="/sign-in" className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 w-fit mx-4">
//                 Get Started <FaArrowRight className="ml-2" />
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { FaCoins, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useRewardPoints } from "@/hooks/useRewardPoints";

const Navbar = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const clerkId = user?.id;
  const { reward, loading } = useRewardPoints(clerkId);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex items-center justify-between space-x-1 h-16">
          <Link href="/" className="flex items-center mr-7 ml-0">
            <Globe className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">EcoRevive</span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">Sustaining Tomorrow</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 items-center text-xl">
            <Link href="/" className="hover:text-green-600 font-medium">Home</Link>
            <Link href="/report" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Report Waste</Link>
            
            <div className="relative group">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:text-green-600 font-medium"
              >
                Reward
              </button>
              <div className={`absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 ${dropdownOpen ? "block" : "hidden"} group-hover:block`}>
                <Link href="/leaderboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Leaderboard</Link>
                <Link href="/reward" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Reward</Link>
              </div>
            </div>

            <Link href="/user" className="flex items-center mr-7 ml-0">User</Link>
              <Link href="/contact" className="hover:text-green-600 font-medium">Contact Us</Link>
            <Link href="/instructions" className="hover:text-green-600 font-medium">Instruction</Link>
          </div>

          <div className="flex items-center gap-4">
            {user && !loading && reward && (
              <div className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                <FaCoins className="text-base" />
                <span>{reward.points} pts</span>
              </div>
            )}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 px-2 pb-4">
            <Link href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Home</Link>
            <Link href="/report" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Report Waste</Link>
            <div className="space-y-1">
              <p className="px-4 font-medium text-gray-700 dark:text-gray-200">Reward</p>
              <Link href="/leaderboard" className="block px-6 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Leaderboard</Link>
              <Link href="/reward" className="block px-6 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Reward</Link>
            </div>
             <Link href="/contact" className="hover:text-green-600 font-medium">Contact Us</Link>
            <Link href="/instruction" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Instruction</Link>
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in" className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 w-fit mx-4">
                Get Started <FaArrowRight className="ml-2" />
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

