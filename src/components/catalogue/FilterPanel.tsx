"use client";

import { useEffect, useState } from "react";
import { MapPin, CalendarDays, User, ChevronDown } from "lucide-react";
import { CarTypes } from "@/types/homePageTypes";

export default function SideFilterPanel({data}) {
  const [returnLocation, setReturnLocation] = useState(
    "Different Return Location",
  );
  const [driverAge, setDriverAge] = useState(" Driver's Age: 18+");
  const [pickup, setPickup] = useState("Dubai Mall, Downtown Dubai, Dubai");
 

const tabs = ["All", ...(data?.categories?.map(c => c.name) || [])];
  const [activeTab, setActiveTab] = useState("All");
 useEffect(() => {
  console.log("Cars:", data?.cars);
}, [data]);

  const filteredCars =
  activeTab === "All"
    ? data?.cars
    : data?.cars?.filter(
        (item) =>
          item?.car?.category?.name
            ?.toLowerCase()
            ?.trim() === activeTab.toLowerCase().trim()
      );
      const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const today = new Date();

const afterTwoDays = new Date();
afterTwoDays.setDate(today.getDate() + 2);

const dateRange = `${formatDate(today)} - ${formatDate(afterTwoDays)}`;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      {/* Title */}
      <h3 className="text-lg font-extrabold text-gray-900 mb-4">
        Find rentals near
      </h3>

     <div className="mb-3">
  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
        <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-gray-500" />
      <span className="truncate">{returnLocation}</span>
    </div>
  </button>
</div>

     <div className="mb-3">
  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
        <div className="flex items-center gap-3">
      <User className="w-5 h-5 text-gray-500" />
      <span>{driverAge}</span>
    </div>
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

          <p className="text-sm font-semibold text-white mt-2">
            Earn AED 100 Dubai credit when you complete your first booking.
          </p>

          <button className="mt-4 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-white transition">
            Enroll Now
          </button>
        </div>
      </div>
    {filteredCars?.map((carItem) => (
      <div key={carItem._id}>
        <p className="text-xs text-gray-500">
          {carItem?.car?.category || "Car"}
        </p>
      </div>
    ))}

    <div className="mt-6 border-b border-gray-200">
      <div
        className="
          flex gap-6
          overflow-x-auto
          whitespace-nowrap
          max-w-full
          scrollbar-hide
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-bold flex-shrink-0 transition ${
              activeTab === tab
                ? "text-gray-900 border-b-2 border-site-accent"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
   <div className="mt-4 space-y-3">
  {/* {filteredCars?.length > 0 ? (
    filteredCars.map((carItem) => (
      <div
        key={carItem._id}
        className="flex items-center gap-3 rounded-xl border p-3"
      >
        <img
          src={carItem?.car?.image}
          alt={carItem?.car?.name}
          className="h-16 w-24 rounded-lg object-cover"
        />

        <div>
          <p className="font-bold text-sm">
            {carItem?.car?.name}
          </p>

          <p className="text-xs text-gray-500">
            {carItem?.car?.category || "Car"}
          </p>

          <p className="text-xs font-semibold text-gray-700">
            AED {carItem?.car?.price} / day
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">
      No cars found for this category
    </p>
  )} */}
     </div>
    </div>
  );
}