"use client";

import { Skeleton } from "@/components/ui/skeleton";

const CompactCarCardSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* IMAGE */}
        <div className="relative w-full md:w-[34%] h-[220px] md:h-[220px] bg-gray-100">
          <Skeleton className="w-full h-full" />

          <div className="absolute top-3 left-3">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-full md:w-[66%] p-4 flex flex-col gap-2 relative">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex items-baseline gap-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-3 w-8" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-3 w-36" />
          </div>

          <div className="flex gap-2 w-full md:w-[360px] mt-1">
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>

          <div className="flex items-center gap-3 mt-1">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-3 w-16" />

            <div className="absolute right-4">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCarCardSkeleton;
