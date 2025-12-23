"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import CategoryMegaMenu from "@/components/megamenu/CategoryMegaMenu";
import BrandMegaMenu from "@/components/megamenu/BrandMegaMenu";
import BudgetMegaMenu from "@/components/megamenu/BudgetMegaMenu";
import Link from "next/link";

interface MobileMegaMenuProps {
  data: {
    categories: [{ _id: string; name: string }];
    brands: [{ _id: string; name: string; logo: { url: string } }];
  };
  isOpen: boolean;
  onClose: () => void;
}

type ActiveSection = "category" | "brand" | "budget" | null;

const MobileMegaMenu = ({ data, isOpen, onClose }: MobileMegaMenuProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  if (!isOpen) return null;

  const toggleSection = (section: ActiveSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-site-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-site-accent to-slate-teal text-white p-6 flex items-center justify-between border-b border-site-accent/20 shadow-lg">
          <h2 className="text-xl font-bold">Browse Cars</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <Link
            href="/catalog/all/cars"
            onClick={onClose}
            className="block w-full text-left px-4 py-3 rounded-lg text-site-primary font-semibold hover:bg-gradient-to-r hover:from-site-accent/5 hover:to-slate-teal/5 transition-all duration-300 mb-2"
          >
            All Cars
          </Link>

          <div className="space-y-2">
            <button
              onClick={() => toggleSection("category")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-site-primary font-semibold hover:bg-gradient-to-r hover:from-site-accent/5 hover:to-slate-teal/5 transition-all duration-300"
              aria-expanded={activeSection === "category"}
            >
              <span>By Category</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  activeSection === "category" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSection === "category" && (
              <div className="pl-2 animate-slide-up">
                <CategoryMegaMenu data={data?.categories} onClose={onClose} />
              </div>
            )}

            <button
              onClick={() => toggleSection("brand")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-site-primary font-semibold hover:bg-gradient-to-r hover:from-site-accent/5 hover:to-slate-teal/5 transition-all duration-300"
              aria-expanded={activeSection === "brand"}
            >
              <span>By Brand</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  activeSection === "brand" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSection === "brand" && (
              <div className="pl-2 animate-slide-up">
                <BrandMegaMenu data={data?.brands} onClose={onClose} />
              </div>
            )}

            <button
              onClick={() => toggleSection("budget")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-site-primary font-semibold hover:bg-gradient-to-r hover:from-site-accent/5 hover:to-slate-teal/5 transition-all duration-300"
              aria-expanded={activeSection === "budget"}
            >
              <span>By Budget</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  activeSection === "budget" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSection === "budget" && (
              <div className="pl-2 animate-slide-up">
                <BudgetMegaMenu onClose={onClose} />
              </div>
            )}
          </div>

          <Link
            href="/contact"
            onClick={onClose}
            className="block w-full text-left px-4 py-3 rounded-lg text-site-primary font-semibold hover:bg-gradient-to-r hover:from-site-accent/5 hover:to-slate-teal/5 transition-all duration-300 mt-2"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMegaMenu;
