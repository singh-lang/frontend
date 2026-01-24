"use client";

import { useState } from "react";
import { MapPin, CalendarDays, User, ChevronDown } from "lucide-react";

export default function SideFilterPanel() {
  const [returnLocation, setReturnLocation] = useState(
    "Different return location",
  );
  const [driverAge, setDriverAge] = useState("Main driver's age: 30+");
  const [pickup, setPickup] = useState("Dubai Mall, Downtown Dubai, Dubai");
  const [dateRange, setDateRange] = useState(
    "Jul 12, 11:00 AM - Jul 19, 11:00 AM",
  );

  const tabs = ["All", "Economy", "Compact", "SUV"];
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      {/* Title */}
      <h3 className="text-lg font-extrabold text-gray-900 mb-4">
        Find rentals near
      </h3>

      {/* Dropdown 1 */}
      <div className="mb-3">
        <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
          <span>{returnLocation}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Dropdown 2 */}
      <div className="mb-3">
        <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
          <span>{driverAge}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Location */}
      <div className="mb-3">
        <div className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <p className="text-sm font-semibold text-gray-700 truncate">
            {pickup}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <div className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <p className="text-sm font-semibold text-gray-700 truncate">
            {dateRange}
          </p>
        </div>
      </div>

      {/* Search Button */}
      <button className="w-full rounded-xl bg-gradient-to-r from-site-accent to-slate-teal px-4 py-3 text-sm font-bold text-white shadow hover:shadow-md transition">
        Search
      </button>

      {/* Promo Card */}
      <div className="mt-5 rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-sky-200 to-teal-200 p-4">
          <h4 className="text-xl font-extrabold text-white drop-shadow">
            Sign up now,
            <br />
            get AED 100!
          </h4>

          <p className="text-sm font-semibold text-white/90 mt-2">
            Earn AED 100 Dubai credit when you complete your first booking.
          </p>

          <button className="mt-4 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-white transition">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-5 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-2 text-sm font-bold transition ${
              activeTab === t
                ? "text-gray-900 border-b-2 border-site-accent"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
