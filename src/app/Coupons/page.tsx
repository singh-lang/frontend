"use client";

import React from "react";
import { useGetCouponsQuery } from "@/lib/api/couponApi";
import { 
  TagIcon, 
  TicketIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
import Navbar from "@/components/home/Navbar";

const CouponList = () => {
  const { data, isLoading, error } = useGetCouponsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading coupons...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md text-center">
          <XCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
<p className="text-gray-600 mb-6">
  We couldn&apos;t load the coupons. Please try again later.
</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Coupons</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing discounts and offers to enhance your shopping experience
          </p>
        </div>

       
       {data?.data && data.data.length > 0 && (
  <div className="mb-6 md:mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
    
    {/* Mobile: 3 columns side by side */}
    <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
      
      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
        <p className="text-xl md:text-3xl font-bold text-gray-900">
          {data.data.length}
        </p>
        <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
          Total Coupons
        </p>
      </div>

      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
        <p className="text-xl md:text-3xl font-bold text-gray-900">
          {data.data.filter(c => c.isActive).length}
        </p>
        <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
          Active Coupons
        </p>
      </div>

      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
        <p className="text-xl md:text-3xl font-bold text-gray-900">
          {data.data.filter(c => !c.isActive).length}
        </p>
        <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
          Inactive Coupons
        </p>
      </div>

    </div>
  </div>
)}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data?.data.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border ${
                coupon.isActive 
                  ? "border-gray-200 hover:border-gray-300" 
                  : "border-gray-200 opacity-80"
              }`}
            >
              {/* Coupon Code & Status */}
                 <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start ">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TagIcon className="h-5 w-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                        {coupon.couponType === "PERCENTAGE" ? "Percentage " : " Amount"}
                      </span>
                    </div>
                    <h3 className="text-1xl font-bold text-gray-900 tracking-tight">
                      {coupon.code}
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    coupon.isActive 
                      ? "bg-gradient-to-r from-site-accent to-slate-teal text-white" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                  </div>
                </div>
              </div>

             <div className="p-6">
                {/* Discount Display */}
                <div className="mb-6">
                  {coupon.couponType === "PERCENTAGE" ? (
                    <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="text-sm font-semibold text-gray-600 mb-1">DISCOUNT</p>
                      <p className="text-3xl font-black text-gray-900">
                        {coupon.percentage}%
                        <span className="text-lg font-medium text-gray-600 ml-2">OFF</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="text-sm font-semibold text-gray-600 mb-1">FLAT DISCOUNT</p>
                      <p className="text-4xl font-black text-gray-900">
                        {coupon.amount}
                        <span className="text-lg font-medium text-gray-600 ml-2">OFF</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {coupon.isActive ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Ready to use</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-gray-700">Currently unavailable</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-500">
                    ID: {coupon._id?.slice(-6)}
                  </div>
                </div>
              </div>


              {/* Action Button */}
              <div className="p-4 pt-2">
                <button 
                  className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                    coupon.isActive
                      ? "bg-gradient-to-r from-site-accent to-slate-teal text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!coupon.isActive}
                >
                  {coupon.isActive ? "Use Coupon" : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!data?.data || data.data.length === 0) && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <TicketIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Coupons Available</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              There are currently no coupons available. Check back later for amazing offers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponList;