"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "@bprogress/next/app";
import { z } from "zod";
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import { useEffect, useRef, useState } from "react";

/* =========================
   Types
========================= */
interface SearchCar {
  _id: string;
  title?: string;
}
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

/* =========================
   Component
========================= */
const HeroFormLayout = ({ brands, bodyTypes }: SearchFormProps) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [triggerSearch, { data: searchedCars, isFetching, error }] =
    useLazyGetSearchedCarsQuery();

  const { handleSubmit, control, watch } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: { search: "" },
  });

  const searchValue = watch("search") || "";

  /* =========================
     Debounced search
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        setIsSearchOpen(true);
        triggerSearch(searchValue);
      } else {
        setIsSearchOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, triggerSearch]);

  /* =========================
     Outside click close
  ========================= */
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

  /* =========================
     Submit (Enter / Button)
  ========================= */
  const onSubmit = (data: FilterFormData) => {
    if (!data.search?.trim()) return;

    const params = new URLSearchParams();
    params.set("search", data.search.trim());

    setIsSearchOpen(false);
    router.push(`/catalog/all/cars?${params.toString()}`);
  };

  /* =========================
     Dropdown click
  ========================= */
  const handleSuggestionClick = (value: string) => {
    if (!value.trim()) return;

    const params = new URLSearchParams();
    params.set("search", value.trim());

    setIsSearchOpen(false);
    router.push(`/catalog/all/cars?${params.toString()}`);
  };

  /* =========================
     Normalize API response
  ========================= */
  const carsList =
    searchedCars?.result?.length > 0
      ? searchedCars.result
      : searchedCars?.data
        ? [searchedCars.data]
        : [];

  const totalResults = carsList.length;

  /* =========================
     JSX
  ========================= */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div
        ref={dropdownRef}
        className="w-full max-w-5xl mx-auto mt-5 mb-5 px-4"
      >
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Search className="hidden sm:inline w-5 h-5" />
          </div>

          {/* Input */}
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Search Your Dream Car"
                onFocus={() => field.value?.trim() && setIsSearchOpen(true)}
                className="
                  w-full h-14 sm:h-16
                  rounded-2xl
                  border border-gray-200
                  bg-white/40 backdrop-blur-md
                  pl-12 pr-16 sm:pr-44
                  text-base sm:text-lg font-medium
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  shadow-sm
                  focus:ring-2 focus:ring-site-accent/40
                "
              />
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              h-11 sm:h-14
              px-3 sm:px-6
              rounded-full sm:rounded-2xl
              bg-transparent sm:bg-gradient-to-r sm:from-site-accent sm:to-slate-teal
              text-gray-600 sm:text-white
              font-semibold
              transition
              flex items-center gap-2
            "
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Explore Cars</span>
          </button>

          {/* Dropdown */}
          {isSearchOpen && (
            <div
              className="
                absolute top-[64px] sm:top-[72px] left-0 right-0
                bg-white
                rounded-2xl
                shadow-2xl
                border border-gray-100
                z-50
                max-h-80
                overflow-auto
              "
            >
              {/* Header */}
              <div className="px-4 py-3 text-sm font-semibold text-gray-600 border-b flex justify-between">
                <span>Search results</span>
                {totalResults > 0 && (
                  <span className="text-gray-400">{totalResults} cars</span>
                )}
              </div>

              {isFetching ? (
                <div className="p-4 text-base text-gray-500">Searching…</div>
              ) : error ? (
                <div className="p-4 text-base text-red-500">
                  Failed to fetch cars
                </div>
              ) : totalResults > 0 ? (
                <>
                  {carsList.map((car: SearchCar) => {
                    const { brand, model } = tokenizeCarTitle(car.title || "");
                    const searchText = `${brand} ${model}`.trim();

                    return (
                      <button
                        key={car._id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(searchText)}
                        className="
                          w-full text-left
                          px-4 py-4
                          flex items-center gap-4
                          hover:bg-gray-50
                          transition
                        "
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <Search className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-gray-900">
                            {highlightText(model || brand, searchValue)}
                          </span>
                          <span className="text-sm text-gray-500">{brand}</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Show all */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(searchValue)}
                    className="
                      w-full
                      px-4 py-4
                      border-t
                      flex items-center justify-between
                      text-site-accent
                      font-semibold
                      hover:bg-site-accent/5
                    "
                  >
                    <span>Show all {totalResults} cars</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="p-4 text-base text-gray-500">No cars found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default HeroFormLayout;

/* =========================
   Helpers
========================= */
const tokenizeCarTitle = (title = "") => {
  const parts = title.split(" ");
  return {
    brand: parts[0] || "",
    model: parts.slice(1, 3).join(" "),
  };
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "ig");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="font-semibold text-site-accent">
        {part}
      </span>
    ) : (
      part
    ),
  );
};
