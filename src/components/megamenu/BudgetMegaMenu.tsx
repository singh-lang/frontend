"use client";

import Link from "next/link";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@bprogress/next/app";

interface BudgetMegaMenuProps {
  onClose: () => void;
}

const budgetRanges = [
  {
    label: "Under 300",
    min: 0,
    max: 300,
    path: "/catalog/all/cars?priceRange=0-300",
    color:
      "from-green-500/10 to-green-600/10 border-green-500/30 text-green-700",
  },
  {
    label: "300 - 600",
    min: 300,
    max: 600,
    path: "/catalog/all/cars?priceRange=300-600",
    color: "from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-700",
  },
  {
    label: "600 - 1,000",
    min: 600,
    max: 1000,
    path: "/catalog/all/cars?priceRange=600-1000",
    color:
      "from-site-accent/10 via-site-accent/5 to-slate-teal/10 border-site-accent/30 text-site-accent",
  },
  {
    label: "1,000 - 2,000",
    min: 1000,
    max: 2000,
    path: "/catalog/all/cars?priceRange=1000-2000",
    color:
      "from-orange-500/10 to-orange-600/10 border-orange-500/30 text-orange-700",
  },
  {
    label: "2,000+",
    min: 2000,
    max: 10000,
    path: "/catalog/all/cars?priceRange=2000-10000",
    color:
      "from-site-primary/10 to-slate-teal/10 border-site-primary/30 text-site-primary",
  },
];

const BudgetMegaMenu = ({ onClose }: BudgetMegaMenuProps) => {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  const handleCustomSearch = () => {
    router.push(`/catalog/all/cars?priceRange=${minPrice}-${maxPrice}`);
    onClose();
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-soft-grey/20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <h3 className="text-sm font-semibold text-site-secondary mb-6 uppercase tracking-wider">
          Browse by Daily Budget (AED)
        </h3>

        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-site-accent/5 via-off-white/50 to-slate-teal/5 border border-soft-grey/30 shadow-sm">
          <h4 className="text-sm font-semibold text-site-primary mb-4">
            Custom Price Range
          </h4>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-site-secondary mb-2">
                Min Price (AED)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-lg border border-soft-grey/40 bg-white focus:outline-none focus:border-site-accent focus:ring-2 focus:ring-site-accent/30 focus:ring-offset-1 transition-all text-site-primary font-medium"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-site-secondary mb-2">
                Max Price (AED)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 5000)}
                className="w-full px-4 py-2.5 rounded-lg border border-soft-grey/40 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-site-accent/30 focus:ring-offset-1 transition-all text-site-primary font-medium"
              />
            </div>
            <button
              onClick={handleCustomSearch}
              className="w-full sm:w-auto bg-gradient-to-r from-site-accent via-site-accent/95 to-slate-teal/80 hover:from-site-accent hover:via-site-accent hover:to-slate-teal text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-xl hover:shadow-site-accent/30 hover:-translate-y-0.5"
            >
              Apply Range
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {budgetRanges.map((range) => (
            <Link
              key={range.label}
              href={range.path}
              onClick={onClose}
              className={`group p-5 rounded-xl bg-gradient-to-br ${range.color} border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              role="menuitem"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">
                    AED {range.label}
                  </h4>
                  <p className="text-xs opacity-75">per day</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetMegaMenu;
