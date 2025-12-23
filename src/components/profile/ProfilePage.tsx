"use client";

import { useState, useEffect } from "react";
import { User, Car as CarIcon, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


// Import your existing tab components
import MyProfile from "@/components/profile/MyProfile";
import MyBookings from "@/components/profile/MyBookings";
import MyDocuments from "@/components/profile/MyDocuments";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Tabs: only 3 main sections
  const [activeTab, setActiveTab] = useState<
    "profile" | "bookings" | "documents"
  >("profile");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-base mb-2">My Account</h1>
          <p className="text-grey">Manage your profile, bookings, and documents</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-soft-grey/20 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-soft-grey/20">
            <div className="flex overflow-x-auto">
              {[
                { id: "profile", icon: User, label: "Profile" },
                { id: "bookings", icon: CarIcon, label: "My Bookings" },
                { id: "documents", icon: FileText, label: "Documents" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all ${
                    activeTab === id
                      ? "text-accent border-b-2 border-accent bg-accent/5"
                      : "text-grey hover:text-dark-base hover:bg-soft-grey/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "profile" && <MyProfile />}
            {activeTab === "bookings" && <MyBookings />}
            {activeTab === "documents" && <MyDocuments />}
          </div>
        </div>
      </div>

  
    </div>
  );
}
