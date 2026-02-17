"use client";

import { useEffect, useRef, useState } from "react";
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "@bprogress/next/app";
import { Search } from "lucide-react";

const MobileSearch = () => {
  const router = useRouter();
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [triggerSearch, { data, isFetching, error }] =
    useLazyGetSearchedCarsQuery();

  useEffect(() => {
    if (!searchText.trim()) {
      setIsSearch(false);
      return;
    }

    setIsSearch(true);

    const timer = setTimeout(() => {
      triggerSearch({
        query: searchText.trim(),
        page: 1,
      });
    }, 400); // 👈 debounce

    return () => clearTimeout(timer);
  }, [searchText, triggerSearch]);

  const handleClick = (title: string) => {
    setIsSearch(false);
    router.push(`/catalog/all/cars?query=${encodeURIComponent(title)}`);
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
    <div ref={dropdownRef} className="relative w-full">
      <div className="flex items-center w-full bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-site-accent focus-within:ring-2 focus-within:ring-site-accent/20 transition">
        <div className="pl-4 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search cars..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-3 py-3 focus:outline-none text-sm"
        />
      </div>

      {isFetching && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-2xl shadow-xl z-50 p-4 space-y-2 max-h-64 overflow-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[16px]" />
          ))}
        </div>
      )}

      {!isFetching && isSearch && data?.result?.length === 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-2xl shadow-xl z-50 p-1 max-h-64 overflow-auto">
          {data.result.map((car) => (
            <button
              key={car._id}
              onClick={() => handleClick(car.title)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 rounded-xl"
            >
              {car.title}
            </button>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!isFetching && isSearch && data?.result?.length === 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-2xl shadow-xl z-50 px-4 py-3 text-sm text-gray-500">
          No cars found.
        </div>
      )}

      {error && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-red-200 rounded-2xl shadow-xl z-50 px-4 py-3 text-sm text-red-600">
          Failed to fetch cars. Try again.
        </div>
      )}
    </div>
  );
};

export default MobileSearch;