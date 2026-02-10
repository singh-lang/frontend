"use client";
import { ArrowUpDown } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/hooks";
import { setCatalogFilters } from "@/lib/slice/catalogFiltersSlice";

interface SortingBarProps {
  sortBy?: string;
  setSortBy?: (sortBy: string) => void;
  totalResults?: number;
  categories?: { _id: string; name: string }[];
}

export default function SortingBar({
  sortBy,
  setSortBy,
  totalResults,
  categories = [],
}: SortingBarProps) {
  const displatch = useAppDispatch();
  // ✅ Get selected category IDs from Redux
  const { category, brand, bodyType, noDeposit, priceRange, location, sort } =
    useAppSelector((state) => state.catalogFilters);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    displatch(
      setCatalogFilters({
        category,
        brand,
        bodyType,
        noDeposit,
        priceRange,
        location,
        sort: e.target.value,
          hasUserSorted: true,
      })
    );
  };

  // ✅ Match IDs to category names
  const selectedCategories = categories
    .filter((c) => category.includes(c._id))
    .map((c) => c.name);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-2xl z-40 mb-4 md:mb-6 border border-white/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-site-accent/5 via-transparent to-slate-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-site-accent to-slate-teal rounded-full"></div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-site-primary">
                Available Cars
              </h2>
            </div>

            <p className="text-xs md:text-sm text-site-secondary pl-4 md:pl-7">
              {" "}
              <span className="font-semibold text-site-primary">
                {selectedCategories.length > 0
                  ? selectedCategories.join(", ")
                  : " "}
              </span>
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 md:w-9 h-8 md:h-9 rounded-lg bg-gradient-to-br from-site-accent/10 to-slate-teal/10 flex items-center justify-center">
                <ArrowUpDown className="w-4 md:w-5 h-4 md:h-5 text-site-accent" />
              </div>
              <span className="text-secondary font-medium text-sm">
                Sort by:
              </span>
            </div>

            <select
              value={sort}
              onChange={(e) => handleSortChange(e)}
              className="flex-1 sm:flex-none bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="newest">Newest Cars</option>
              <option value="lowestPrice">Price: Low to High</option>
              <option value="highestPrice">Price: High to Low</option>
              <option value="mostBooked">Most Booked</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
