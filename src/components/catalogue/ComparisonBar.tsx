"use client";

import { X, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

import { useComparison } from "@/contexts/ComparisionContext";
import DirhamSymbol from "../shared/DirhamSymbol";
import Image from "next/image";

export default function ComparisonBar() {
  const { comparisonCars, removeFromComparison, clearComparison } =
    useComparison();

  if (comparisonCars.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-accent/20 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-sm font-bold text-dark-base">
              {comparisonCars.length} Car{comparisonCars.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {comparisonCars.map((car) => (
              <div key={car._id} className="relative flex-shrink-0">
                <Image
                  src={car.car.images[0]?.url || "/assets/car_placeholder.png"}
                  alt={`${car.car.carBrand.name} ${car.title}`}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-accent/30"
                  width={100}
                  height={100}
                />
                <button
                  onClick={() => removeFromComparison(car._id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="text-xs font-semibold text-grey hover:text-dark-base transition-colors"
            >
              Clear
            </button>
            <Link
              href={comparisonCars.length >= 2 ? "/compare" : "#"}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                comparisonCars.length >= 2
                  ? "bg-gradient-to-r from-accent to-slate-teal text-white shadow-lg"
                  : "bg-soft-grey/30 text-grey cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (comparisonCars.length < 2) e.preventDefault();
              }}
            >
              Compare
            </Link>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-accent" />
              <span className="font-bold text-dark-base">
                Compare Cars ({comparisonCars.length}/3)
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto">
              {comparisonCars.map((car) => (
                <div
                  key={car._id}
                  className="flex items-center gap-2 bg-soft-grey/20 rounded-lg px-3 py-2 border border-soft-grey/40"
                >
                  <Image
                    src={
                      car.car.images[0]?.url || "/assets/car_placeholder.png"
                    }
                    alt={`${car.car.carBrand.name} ${car.title}`}
                    className="w-10 h-10 rounded object-cover"
                    height={100}
                    width={100}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-dark-base truncate max-w-[120px]">
                      {car.car.carBrand.name} {car.title}
                    </p>
                    <p className="text-xs text-grey flex items-center gap-1">
                      <DirhamSymbol className="w-2.5 h-2.5" />
                      {car.rentPerDay.toLocaleString()}/day
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromComparison(car._id)}
                    className="text-grey hover:text-danger transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm font-semibold text-grey hover:text-dark-base transition-colors"
            >
              Clear All
            </button>
            <Link
              href={comparisonCars.length >= 2 ? "/compare" : "#"}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                comparisonCars.length >= 2
                  ? "bg-gradient-to-r from-accent to-slate-teal text-white shadow-lg hover:shadow-xl"
                  : "bg-soft-grey/30 text-grey cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (comparisonCars.length < 2) e.preventDefault();
              }}
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
