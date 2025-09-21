"use client";
import React, { useState, useEffect } from "react";
import { useSignIn, useUser, useAuth } from "@clerk/clerk-react";
import { Globe } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { 
  Menu, Coins, Search, Bell, User, ChevronDown, LogIn, LogOut 
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Notification } from "@/database/models/notificationSchema";
import { getUnreadNotifications, markNotificationsAsRead, getUserByEmail, getUserBalance } from "@/database/action";
import { UserButton } from "@clerk/nextjs";

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

const Header = ({ onMenuClick, totalEarnings }: HeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isSignedIn, user } = useUser();
  const { signOut,sessionId } = useAuth();
  const { signIn } = useSignIn();
  
  const [userInfo, setUserInfo] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
   
    const fetchNotifications = async () => {
      if (userInfo?.email) {
        const dbUser = await getUserByEmail(userInfo.email);
        if (dbUser) {
          const unreadNotifications = await getUnreadNotifications(dbUser.id);
          setNotifications(unreadNotifications);
        }
      }
    };

    fetchNotifications();
    const notificationInterval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(notificationInterval);
  }, [userInfo]);
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (userInfo?.email) {
        const dbUser = await getUserByEmail(userInfo.email);
        if (dbUser) {
          const userBalance = await getUserBalance(dbUser.id);
          setBalance(userBalance);
        }
      }
    };
    fetchUserBalance();
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };
    window.addEventListener("balanceUpdated", handleBalanceUpdate as EventListener);
    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate as EventListener);
    };
  }, [userInfo]);

  useEffect(() => {
    if (isSignedIn && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userEmail) {
        localStorage.setItem("userEmail", userEmail);
        setUserInfo(user);
      } else {
        console.log("Email is not set.");
      }
    } else {
      setUserInfo(null);
      localStorage.removeItem("userEmail");
    }
  }, [isSignedIn, user]);
  useAuth(()=>{
    console.log(userInfo);
  },[])
  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationsAsRead(notificationId);
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:mr-4" onClick={onMenuClick}>
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <Link href="/" className="flex items-center">
            <Globe className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">EcoRevive</span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">Sustaining Tomorrow</span>
            </div>
          </Link>
        </div>

        {!isMobile && (
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} onClick={() => handleNotificationClick(notification.id)}>
                    <div className="flex flex-col">
                      <span className="font-medium">{notification.type}</span>
                      <span className="text-sm text-gray-500">{notification.message}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">
              {balance.toFixed(2)}
            </span>
          </div>
   
             <UserButton / >
        </div>
      </div>
    </header>
  );
};
export default Header;
