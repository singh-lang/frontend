"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface BrandMegaMenuProps {
  data: [{ _id: string; name: string; logo: { url: string } }];
  onClose: () => void;
}

export default function BrandMegaMenu({ data, onClose }: BrandMegaMenuProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? data : data.slice(0, 12);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-soft-grey/20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-site-secondary uppercase tracking-wider">
            Browse by Brand
          </h3>

          {/* Toggle expand/collapse instead of navigating away */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowAll((s) => !s);
            }}
            className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent hover:from-slate-teal hover:to-site-accent transition-all duration-300 font-medium"
            role="menuitem"
          >
            {showAll ? "Show less" : "View all brands"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visible.map((brand) => (
            <Link
              key={brand._id}
              href={`/catalog/all/cars?brand=${brand._id}`}
              onClick={onClose}
              className="group p-4 rounded-xl bg-gradient-to-br from-off-white/50 to-white border border-soft-grey/30 hover:border-site-accent/40 hover:shadow-xl hover:shadow-site-accent/10 transition-all duration-300 hover:-translate-y-1"
              role="menuitem"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-site-accent/5 via-white to-slate-teal/5 flex items-center justify-center border border-soft-grey/20 group-hover:border-site-accent/40 group-hover:from-site-accent/10 group-hover:to-slate-teal/10 transition-all duration-300 shadow-sm overflow-hidden">
                  <Image
                    src={brand.logo.url}
                    alt={`${brand.name} logo`}
                    width={56}
                    height={56}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h4 className="font-semibold text-site-primary text-sm group-hover:bg-gradient-to-r group-hover:from-site-accent group-hover:to-slate-teal group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {brand.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
