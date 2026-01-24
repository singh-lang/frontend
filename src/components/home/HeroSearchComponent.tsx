"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "@bprogress/next/app";
import { z } from "zod";
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import { useEffect, useRef, useState } from "react";

interface SearchFormProps {
  brands: {
    _id: string;
    name: string;
    logo: { url: string };
  }[];
  bodyTypes: {
    _id: string;
    name: string;
  }[];
}
const filterSchema = z.object({
  search: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

const HeroFormLayout = ({ brands, bodyTypes }: SearchFormProps) => {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ✅ API Hook (string param)
  const [triggerSearch, { data: searchedCars, isFetching, error }] =
    useLazyGetSearchedCarsQuery();

  const { handleSubmit, control, watch } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: { search: "" },
  });

  const searchValue = watch("search") || "";

  // ✅ Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim() !== "") {
        setIsSearchOpen(true);
        triggerSearch(searchValue);
      } else {
        setIsSearchOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, triggerSearch]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const onSubmit = (data: FilterFormData) => {
    const params = new URLSearchParams();

    if (data.search?.trim()) {
      params.set("search", data.search.trim());
    }

    setIsSearchOpen(false);
    router.push(`/catalog/all/cars?${params.toString()}`);
  };

  const handleCarClick = (carId: string) => {
    setIsSearchOpen(false);
    router.push(`/car/${carId}`);
  };

  // ✅ Support result[] OR data{}
  const carsList =
    searchedCars?.result?.length > 0
      ? searchedCars.result
      : searchedCars?.data
        ? [searchedCars.data]
        : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div
        className="w-full max-w-5xl mx-auto mb-5 mt-5 px-4"
        ref={dropdownRef}
      >
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Search Your Dream Car..."
                onFocus={() => {
                  if (field.value?.trim()) setIsSearchOpen(true);
                }}
                className="
                  placeholder:text-white/70
                  w-full
                  h-14 sm:h-16
                  rounded-2xl
                  border border-gray-200
                  bg-white/30 backdrop-blur-md
                  pl-12
                  pr-[135px] sm:pr-44
                  text-sm sm:text-base font-medium
                  text-gray-800
                  outline-none
                  shadow-sm
                  focus:ring-2 focus:ring-site-accent/40
                "
              />
            )}
          />

          {/* Button */}
          <button
            type="submit"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              h-11 sm:h-14
              px-3 sm:px-6
              rounded-2xl
              bg-gradient-to-r from-site-accent to-slate-teal
              text-white font-semibold
              shadow-md hover:shadow-lg
              transition
              flex items-center gap-2
              whitespace-nowrap
              text-xs sm:text-sm
            "
          >
            <Search className="w-4 h-4" />
            Explore Cars
          </button>

          {/* Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-[64px] sm:top-[72px] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-auto">
              {isFetching ? (
                <div className="p-4 text-sm text-gray-500">Searching...</div>
              ) : error ? (
                <div className="p-4 text-sm text-red-500">
                  Failed to fetch cars
                </div>
              ) : carsList.length > 0 ? (
                carsList.map((car) => (
                  <div
                    key={car._id}
                    onClick={() => handleCarClick(car._id)}
                    className="px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                  >
                    {car.title?.trim()}
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">No cars found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default HeroFormLayout;
