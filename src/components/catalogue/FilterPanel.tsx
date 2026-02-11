"use client";

import React, { useRef, useState } from "react";
import {
  MapPin,
  CalendarDays,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useGetCouponsQuery } from "@/lib/api/couponApi";
import { TagIcon, CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface Coupon {
  _id: string;
  code: string;
  couponType: "PERCENTAGE" | "AMOUNT";
  percentage?: number;
  amount?: number;
  validTill: string;
  isActive: boolean;
}

/* ================= COMPONENT ================= */

const SideFilterPanel: React.FC = () => {
  const [returnLocation] = useState<string>("Different Return Location");
  const [driverAge] = useState<string>("Driver's Age: 18+");
  const [pickup] = useState<string>(
    "Dubai Mall, Downtown Dubai, Dubai"
  );

  const couponsScrollRef = useRef<HTMLDivElement | null>(null);

  /* ================= FETCH COUPONS (RTK) ================= */

  const { data, isLoading } = useGetCouponsQuery();
  const coupons: Coupon[] = data?.data ?? [];

  /* ================= DATE RANGE ================= */

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const today = new Date();
  const afterTwoDays = new Date();
  afterTwoDays.setDate(today.getDate() + 2);

  const dateRange = `${formatDate(today)} - ${formatDate(afterTwoDays)}`;

  /* ================= SCROLL ================= */

  const scrollLeft = () => {
    couponsScrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    couponsScrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

const [copiedId, setCopiedId] = useState<string | null>(null);

const handleCopy = (code: string, id: string) => {
  navigator.clipboard.writeText(code);
  setCopiedId(id);

  setTimeout(() => {
    setCopiedId(null);
  }, 1500);
};

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
      
      {/* TITLE */}
      <h3 className="text-lg font-extrabold text-gray-900">
        Find rentals near
      </h3>

      {/* RETURN LOCATION */}
      <button className="w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
        <MapPin className="w-5 h-5 text-gray-500" />
        <span className="truncate">{returnLocation}</span>
      </button>

      {/* DRIVER AGE */}
      <button className="w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
        <User className="w-5 h-5 text-gray-500" />
        <span>{driverAge}</span>
      </button>

      {/* PICKUP LOCATION */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <MapPin className="w-5 h-5 text-gray-500" />
        <p className="text-sm font-semibold text-gray-700 truncate">
          {pickup}
        </p>
      </div>

      {/* DATE RANGE */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <CalendarDays className="w-5 h-5 text-gray-500" />
        <p className="text-sm font-semibold text-gray-700 truncate">
          {dateRange}
        </p>
      </div>

      {/* SEARCH BUTTON */}
      <button className="w-full rounded-xl bg-gradient-to-r from-site-accent to-slate-teal px-4 py-3 text-sm font-bold text-white shadow hover:opacity-95 transition">
        Search
      </button>

      {/* ================= COUPON SECTION ================= */}
      <div className="pt-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Available Coupons
          </h3>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <p className="text-sm text-gray-500">Loading coupons...</p>
        )}

        {/* EMPTY */}
        {!isLoading && coupons.length === 0 && (
          <p className="text-sm text-gray-400">No coupons available</p>
        )}

        {/* COUPON LIST */}
     {!isLoading && coupons.length > 0 && (
  <div
    ref={couponsScrollRef}
    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
  >
    {coupons.slice(0, 5).map((coupon) => (
      <div
        key={coupon._id}
        className="min-w-[270px] rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md transition"
      >
 <div className="flex items-center justify-between">
  <div>
    <p className="text-xs text-gray-500 font-medium">
      Coupon Code
    </p>
    <h4 className="font-bold text-gray-900 text-lg tracking-wide">
      {coupon.code}
    </h4>
  </div>

  <button
    onClick={() => handleCopy(coupon.code, coupon._id)}
    className="p-2 rounded-md hover:bg-gray-100 transition"
  >
    {copiedId === coupon._id ? (
      <CheckIcon className="h-5 w-5 text-green-600" />
    ) : (
      <ClipboardIcon className="h-5 w-5 text-gray-600" />
    )}
  </button>
</div>
        <p className="text-sm font-medium text-gray-600 mt-1">
          {coupon.couponType === "PERCENTAGE"
            ? `${coupon.percentage}% OFF`
            : `Flat ₹${coupon.amount} OFF`}
        </p>
       <div className="flex items-center justify-between mt-2">
  <p className="text-xs font-medium text-gray-400">
    Valid till{" "}
    {new Date(coupon.validTill).toLocaleDateString()}
  </p>

  <span
    className={`text-xs px-3 py-1 rounded-full font-medium ${
      coupon.isActive
        ? "bg-gradient-to-r from-site-accent to-slate-teal text-white"
        : "bg-gray-200 text-gray-500"
    }`}
  >
    {coupon.isActive ? "Active" : "Inactive"}
  </span>
</div>

      </div>
    ))}
  </div>
)}


        {/* VIEW ALL */}
        <div className="text-center pt-4 border-t border-gray-100 mt-4">
          <Link
            href="/Coupons"
            className="inline-flex items-center gap-2 text-site-accent font-semibold text-sm hover:gap-3 transition-all group"
          >
            <span>View All Coupons</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SideFilterPanel;
