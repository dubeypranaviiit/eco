"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
  FaUserCircle,
  FaMedal,
  FaRecycle,
  FaEdit,
  FaClipboard,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { BiSolidBadgeCheck } from "react-icons/bi";
import RewardPointsCard from "./RewardPointsCard";

interface UserData {
  clerkId: string;
  name: string;
  email: string;
  createdAt?: string;
}

const UserProfile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user or create automatically
  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        const res = await axios.get("/api/user", {
          headers: { "x-clerk-id": user.id },
        });
        setUserData(res.data);
        setEditedName(res.data.name);
        setEditedEmail(res.data.email);
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Auto-create user
          const createRes = await axios.post("/api/user", {
            clerkId: user.id,
            email:
              user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses[0]?.emailAddress ||
              "",
            name:
              user.fullName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "New User",
          });
          setUserData(createRes.data);
          setEditedName(createRes.data.name);
          setEditedEmail(createRes.data.email);
        } else {
          console.error("Fetch user failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, user]);

  // Animate reward points (placeholder)
  useEffect(() => {
    if (!userData) return;
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev < 1250) return prev + 25; // Replace with API value later
        clearInterval(timer);
        return prev;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [userData]);

  // Save edits
  const handleSave = async () => {
    if (!userData) return;
    try {
      const res = await axios.put("/api/user", {
        clerkId: userData.clerkId,
        email: editedEmail,
        name: editedName,
      });
      setUserData(res.data);
      setIsEditingName(false);
      setIsEditingEmail(false);
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-8xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition-transform hover:scale-[1.02]">
        <div className="p-8">
          <div className="flex flex-col items-center">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500 hover:border-green-600 transition-all"
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-green-500" />
            )}

            {/* Name */}
            <div className="mt-4 flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {editedName}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              {isEditingEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="text-gray-600 border-b-2 border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingEmail(false)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">{editedEmail}</p>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Clerk ID */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Clerk ID: {userData?.clerkId}
              </span>
              <button
                onClick={() => copyToClipboard(userData?.clerkId || "")}
                className="text-green-500 hover:text-green-600 transition-colors"
                aria-label="Copy Clerk ID"
              >
                <FaClipboard className="w-4 h-4" />
              </button>
              {copied && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>

            {/* Reward & Reports */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                <div className="flex justify-center items-center mb-4">
                  <FaMedal className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{count}</div>
                <p className="text-green-700 mt-2">Reward Points</p>
              </div> */}
              <RewardPointsCard />

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                <div className="flex justify-center items-center mb-4">
                  <FaRecycle className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">48</div>
                <p className="text-green-700 mt-2">Reports Submitted</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => {
                  setIsEditingName(true);
                  setIsEditingEmail(true);
                }}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                aria-label="Edit Profile"
              >
                <FaEdit className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                className="flex-1 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                aria-label="View Reports"
              >
                <BiSolidBadgeCheck className="w-5 h-5" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
