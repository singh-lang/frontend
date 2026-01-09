"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCatalogFilters,
  removeCatalogFilters,
} from "@/lib/slice/catalogFiltersSlice";
import { useLazyApplyFiltersQuery } from "@/lib/api/catalog";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { getFilters } from "@/util/helper";
import CatalogSearchBox from "./CatalogSearchBox";

export default function TopFiltersBar({ data }) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useAppSelector((s) => s.catalogFilters);
  const { noDeposit, priceRange, brand, bodyType } = filters;

  const [sort, setSort] = useState("newest");

  const [open, setOpen] = useState({
    deposit: false,
    price: false,
    brand: false,
    bodyType: false,
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [getCars] = useLazyApplyFiltersQuery();

  /* APPLY */
  const applyFilters = () => {
    setOpen({ deposit: false, price: false, brand: false, bodyType: false });

    const page = Number(searchParams.get("page") || 1);
    const final = getFilters({ ...filters, page, sort });

    getCars(final)
      .unwrap()
      .then((res) =>
        dispatch(
          setCatalogCars({
            carsData: res.data.docs,
            page: res.data.page,
            totalPages: res.data.totalPages,
          })
        )
      );

    router.push(`/catalog/all/cars?page=1`, { scroll: false });
  };

  /* CLEAR */
  const clearFilters = () => {
    dispatch(removeCatalogFilters());
    setSort("newest");

    getCars({ page: 1 })
      .unwrap()
      .then((res) =>
        dispatch(
          setCatalogCars({
            carsData: res.data.docs,
            page: res.data.page,
            totalPages: res.data.totalPages,
          })
        )
      );
  };

  /* OPEN ONLY ONE */
  const openOnly = (key: string) =>
    setOpen({
      deposit: key === "deposit",
      price: key === "price",
      brand: key === "brand",
      bodyType: key === "bodyType",
    });

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen({
          deposit: false,
          price: false,
          brand: false,
          bodyType: false,
        });
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* FINAL UI */
  return (
    <div className="sticky top-[82px] z-[20] w-full px-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto">
        <div
          ref={dropdownRef}
          className="
    bg-white
    rounded-3xl
    border border-gray-200
    shadow-sm
    py-4 px-6

    flex flex-nowrap items-center gap-8
    max-w-full

    overflow-x-auto
    overflow-y-hidden
    whitespace-nowrap
    touch-pan-x

    scrollbar-hide
  "
        >
          {/* =============== DEPOSIT =============== */}
          <div className="relative shrink-0">
            <button
              onClick={() => openOnly("deposit")}
              className="flex flex-col cursor-pointer"
            >
              <span className="text-sm font-semibold">Deposit</span>
              <span className="text-gray-600 flex items-center gap-1 text-sm">
                {noDeposit ? "No Deposit" : "Select"}
                <ChevronDown size={16} />
              </span>
            </button>

            {open.deposit && (
              <div className="absolute z-[20] bg-white w-48 mt-2 shadow-xl rounded-2xl p-4">
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={noDeposit}
                    onChange={(e) =>
                      dispatch(
                        setCatalogFilters({ noDeposit: e.target.checked })
                      )
                    }
                  />
                  No Deposit
                </label>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="h-8 w-px bg-gray-200 shrink-0" />

          {/* =============== PRICE =============== */}
          <div className="relative shrink-0">
            <button
              onClick={() => openOnly("price")}
              className="flex flex-col cursor-pointer"
            >
              <span className="text-sm font-semibold">Price</span>
              <span className="text-gray-600 flex items-center gap-1 text-sm">
                AED {priceRange[1]}
                <ChevronDown size={16} />
              </span>
            </button>

            {open.price && (
              <div className="absolute z-[20] bg-white w-60 mt-2 shadow-xl rounded-2xl p-4">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) =>
                    dispatch(
                      setCatalogFilters({
                        priceRange: [0, Number(e.target.value)],
                      })
                    )
                  }
                  className="w-full accent-site-primary"
                />
                <div className="flex justify-between text-sm mt-2 opacity-70">
                  <span>AED 0</span>
                  <span>AED {priceRange[1].toLocaleString()}+</span>
                </div>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="h-8 w-px bg-gray-200 shrink-0" />

          {/* =============== BRAND =============== */}
          <div className="relative shrink-0">
            <button
              onClick={() => openOnly("brand")}
              className="flex flex-col cursor-pointer"
            >
              <span className="text-sm font-semibold">Brand</span>
              <span className="text-gray-600 flex items-center gap-1 text-sm">
                {brand.length ? `${brand.length} selected` : "Select"}
                <ChevronDown size={16} />
              </span>
            </button>

            {open.brand && (
              <div className="absolute z-[20] bg-white w-64 mt-2 shadow-xl rounded-2xl p-4 max-h-72 overflow-y-auto">
                {data.brands.map((b) => (
                  <label key={b._id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={brand.includes(b._id)}
                      onChange={() => {
                        const updated = brand.includes(b._id)
                          ? brand.filter((x) => x !== b._id)
                          : [...brand, b._id];
                        dispatch(setCatalogFilters({ brand: updated }));
                      }}
                    />
                    {b.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="h-8 w-px bg-gray-200 shrink-0" />

          {/* =============== BODY TYPE =============== */}
          <div className="relative shrink-0">
            <button
              onClick={() => openOnly("bodyType")}
              className="flex flex-col cursor-pointer"
            >
              <span className="text-sm font-semibold">Body Type</span>
              <span className="text-gray-600 flex items-center gap-1 text-sm">
                {bodyType.length ? `${bodyType.length} selected` : "Select"}
                <ChevronDown size={16} />
              </span>
            </button>

            {open.bodyType && (
              <div className="absolute z-[20] bg-white w-64 mt-2 shadow-xl rounded-2xl p-4 max-h-72 overflow-y-auto">
                {data.bodyTypes.map((bt) => (
                  <label key={bt._id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={bodyType.includes(bt._id)}
                      onChange={() => {
                        const updated = bodyType.includes(bt._id)
                          ? bodyType.filter((x) => x !== bt._id)
                          : [...bodyType, bt._id];
                        dispatch(setCatalogFilters({ bodyType: updated }));
                      }}
                    />
                    {bt.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="h-8 w-px bg-gray-200 shrink-0" />

          {/* =============== SEARCH BOX =============== */}
          <div className="mt-5 w-full ">
            <CatalogSearchBox />
          </div>

          {/* DIVIDER */}
          <div className="h-10 w-px bg-gray-200 shrink-0" />

          {/* =============== SORT =============== */}

          {/* <ArrowUpDown className="w-7 h-5 text-site-accent" /> */}
          <span className="text-secondary text-sm font-semibold">Sort:</span>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className=" w-80 h-12 flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-site-accent/40 hover:border-site-accent/70 text-center"
          >
            <option value="newest">Newest Cars</option>
            <option value="lowestPrice">Price: Low to High</option>
            <option value="highestPrice">Price: High to Low</option>
            <option value="mostBooked">Most Booked</option>
          </select>

          {/* =============== APPLY + CLEAR =============== */}
          <div className="flex items-center gap-7 ml-auto shrink-0">
            <button
              onClick={applyFilters}
              className="bg-site-primary text-white px-9 py-3 rounded-xl text-sm font-semibold"
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              className="text-sm font-medium bg-soft-grey text-white px-9 py-3 rounded-xl text-sm font-semibold hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
