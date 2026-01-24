"use client";

import { useState, useRef, useEffect } from "react";
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "@bprogress/next/app";

const CatalogSearchBox = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [triggerSearch, { data, isFetching, error }] =
    useLazyGetSearchedCarsQuery();

  /** 🔍 INPUT CHANGE */
  const handleChange = (value: string) => {
    setQuery(value);

    if (value.trim()) {
      setIsSearch(true);
      triggerSearch(value);
    } else {
      setIsSearch(false);
    }
  };

  /** 🔥 ENTER KEY → FREE SEARCH */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsSearch(false);
      router.push(`/catalog/all/cars?search=${encodeURIComponent(query)}`);
    }
  };

  /** ✅ DROPDOWN CLICK */
  const handleClick = (title: string) => {
    setIsSearch(false);
    router.push(`/catalog/all/cars?search=${encodeURIComponent(title)}`);
  };

  /** CLICK OUTSIDE */
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsSearch(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full mb-6">
      <input
        type="text"
        value={query}
        placeholder="Search your dream car..."
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 rounded-lg border border-site-accent/40 focus:outline-none"
      />

      {isFetching && (
        <div className="absolute w-full bg-white mt-2 p-4 shadow-xl rounded-lg z-[99]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={16} />
          ))}
        </div>
      )}

      {!isFetching && isSearch && data?.result?.length > 0 && (
        <div className="absolute w-full bg-white mt-2 shadow-xl rounded-lg z-[99] max-h-64 overflow-auto">
          {data.result.map((car: any) => (
            <div
              key={car._id}
              onClick={() => handleClick(car.title)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {car.title}
            </div>
          ))}
        </div>
      )}

      {!isFetching && isSearch && data?.result?.length === 0 && (
        <div className="absolute w-full bg-white mt-2 p-3 shadow-xl rounded-lg text-sm text-gray-500 z-[99]">
          No cars found
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">
          Failed to fetch search results
        </p>
      )}
    </div>
  );
};

export default CatalogSearchBox;
