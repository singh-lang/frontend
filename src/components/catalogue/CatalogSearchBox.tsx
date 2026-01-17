"use client";

import { useState, useRef, useEffect } from "react";
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "@bprogress/next/app";

const CatalogSearchBox = () => {
  const router = useRouter();
  const [isSearch, setIsSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [triggerSearch, { data: searchedCars, isFetching, error }] =
    useLazyGetSearchedCarsQuery();

  const handleChange = (searchString: string) => {
    if (searchString.trim() !== "") {
      setIsSearch(true);
      triggerSearch(searchString);
    } else {
      setIsSearch(false);
    }
  };

  /* ✅ CORRECT REDIRECT */
  const handleClick = (title: string) => {
    setIsSearch(false);
    router.push(`/catalog/all/cars?search=${encodeURIComponent(title)}`);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsSearch(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div className="relative w-full mx-auto mb-6" ref={dropdownRef}>
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-site-accent/40 hover:border-site-accent/70">
        <input
          type="text"
          placeholder="Search Your Dream Car..."
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-transparent text-black placeholder-gray-400 px-4 py-2.5 md:py-3 focus:outline-none text-sm md:text-base"
        />
      </div>

      {isFetching && (
        <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-xl z-[99] p-4 space-y-2 max-h-64 overflow-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={16} />
          ))}
        </div>
      )}

      {!isFetching && isSearch && searchedCars?.result?.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-xl z-[99] p-1 max-h-64 overflow-auto">
          {searchedCars.result.map((car: { _id: string; title: string }) => (
            <div
              key={car._id}
              onClick={() => handleClick(car.title)}
              className="px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
            >
              {car.title}
            </div>
          ))}
        </div>
      )}

      {!isFetching && isSearch && searchedCars?.result?.length === 0 && (
        <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-xl z-[99] px-4 py-2 text-sm text-gray-500">
          No cars found
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2 text-sm">
          Failed to fetch cars, try again
        </div>
      )}
    </div>
  );
};

export default CatalogSearchBox;
