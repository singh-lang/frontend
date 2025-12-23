"use client";

import { Skeleton } from "@/components/ui/skeleton";

const HorizontalCarCardSkeleton = () => {
  return (
    <div className="w-full block sm:max-h-[400px] bg-white rounded-2xl overflow-hidden shadow-md mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Left image section */}
        <div className="md:w-[40%] h-[380px] bg-gray-100 relative flex-shrink-0">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-4 left-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="absolute top-4 right-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Right details section */}
        <div className="p-6 w-full sm:w-[60%] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>

            {/* Provider + Badge */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-10 h-3" />
                  <Skeleton className="w-8 h-3" />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing and actions */}
          <div className="block sm:flex items-baseline justify-between mt-2">
            <div>
              {/* Period buttons */}
              <div className="flex gap-2 mb-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-14 rounded-lg" />
                ))}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>

              {/* Mileage */}
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col 2xl:flex-row gap-2 mt-4 2xl:mt-0">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarCardSkeleton;
