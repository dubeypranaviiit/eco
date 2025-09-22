
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "@/context/UserContext";
import { useReports } from "@/context/ReportContext";
import { useDonations } from "@/context/DonationContext";
import { FaUserCircle } from "react-icons/fa";

export default function UserProfile() {
  const { user } = useUser();
  const { userData, loading, refreshUser, updateUser } = useUserContext();
  const { reports, fetchReports } = useReports();
  const { donations, fetchDonations } = useDonations();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [fetched, setFetched] = useState(false); 

  useEffect(() => {
    if (user?.id && !fetched) {
      refreshUser();
      fetchReports(user.id);
      fetchDonations(user.id);
      setFetched(true);
    }
  }, [user?.id, fetched, refreshUser, fetchReports, fetchDonations]);

  const openEditModal = () => {
    setEditedName(userData?.name || "");
    setEditedEmail(userData?.email || "");
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    await updateUser({ name: editedName, email: editedEmail });
    setIsEditOpen(false);
  };

  const totalDonations = donations.length;
  const totalAmountDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8">
       
        <div className="flex flex-col items-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
            />
          ) : (
            <FaUserCircle className="w-32 h-32 text-green-500" />
          )}

          <h1 className="mt-4 text-2xl font-bold text-gray-900">{userData?.name}</h1>
          <p className="text-gray-600">{userData?.email}</p>

          <button
            onClick={openEditModal}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Edit Profile
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Reports" value={reports.length} color="bg-green-100" />
            <StatCard
              title="Approved"
              value={reports.filter((r) => r.status === "approved").length}
              color="bg-blue-100"
            />
            <StatCard
              title="Pending"
              value={reports.filter((r) => r.status === "pending").length}
              color="bg-yellow-100"
            />
            {/* <StatCard
              title="Rejected"
              value={reports.filter((r) => r.status === "rejected").length}
              color="bg-red-100"
            /> */}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Donations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Total Donations" value={totalDonations} color="bg-purple-100" />
            <StatCard
              title="Total Amount Donated"
              value={totalAmountDonated}
              color="bg-purple-200"
            />
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`${color} p-6 rounded-lg text-center shadow`}>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <p className="mt-2 text-gray-700">{title}</p>
    </div>
  );
}
