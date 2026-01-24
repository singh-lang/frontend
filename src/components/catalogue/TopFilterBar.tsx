"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCatalogFilters,
  removeCatalogFilters,
} from "@/lib/slice/catalogFiltersSlice";
import { useLazyApplyFiltersQuery } from "@/lib/api/catalog";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";
import { useRouter } from "next/navigation";
import { getFilters } from "@/util/helper";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Car,
  Settings,
  Users,
  Palette,
} from "lucide-react";

export default function TopFiltersBar({ data }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openTransmission, setopenTransmission] = useState(false);
  const [openSeating, setOpenSeating] = useState(false);
  const [openBodyType, setOpenBodyType] = useState(false);
  const [openInterior, setOpenInterior] = useState(false);
  const [openExterior, setOpenExterior] = useState(false);

  const filters = useAppSelector((s) => s.catalogFilters);

  const {
    noDeposit,
    priceRange,
    bodyType = [],
    category = [],
    brand = [],
    regionalSpec = [],
    seatingCapacity = [],
    transmission = [],
    exteriorColor = [],
    interiorColor = [],
  } = filters;

  const [sort, setSort] = useState(filters?.sort || "newest");

  const [openDesktop, setOpenDesktop] = useState({
    deposit: false,
    price: false,
    bodyType: false,
    sort: false,
  });

  // ✅ Full screen filter modal state
  const [openFullFilter, setOpenFullFilter] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [getCars] = useLazyApplyFiltersQuery();

  const openFilter = (key: keyof typeof openDesktop) => {
    setOpenDesktop({
      deposit: false,
      price: false,
      bodyType: false,
      sort: false,
      [key]: true,
    });
  };

  const closeAll = () => {
    setOpenDesktop({
      deposit: false,
      price: false,
      bodyType: false,
      sort: false,
    });
  };

  // ✅ Outside click close (small dropdowns only)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ✅ ESC close full filter
  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFullFilter(false);
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, []);

  // ✅ Apply API
  const applyFilters = async (extra = {}) => {
    const final = getFilters({
      ...filters,
      ...extra,
      page: 1,
      sort,
    });

    try {
      const res = await getCars(final).unwrap();

      dispatch(
        setCatalogCars({
          carsData: res.data.docs,
          page: res.data.page,
          totalPages: res.data.totalPages,
        }),
      );

      router.push(`/catalog/all/cars?page=1`, { scroll: false });
    } catch (err) {
      console.log("Apply Filter Error:", err);
    }
  };

  // ✅ Reset Filters
  const clearFilters = async () => {
    dispatch(removeCatalogFilters());
    setSort("newest");

    try {
      const res = await getCars({ page: 1 }).unwrap();

      dispatch(
        setCatalogCars({
          carsData: res.data.docs,
          page: res.data.page,
          totalPages: res.data.totalPages,
        }),
      );

      router.push(`/catalog/all/cars?page=1`, { scroll: false });
      closeAll();
      setOpenFullFilter(false);
    } catch (err) {
      console.log("Reset Error:", err);
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="sticky top-0 z-[9999] backdrop-blur-md">
        <div className="w-full">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="text-4xl font-medium pt-2 text-slate-900">
              Choose a Car
            </div>
            <div
              ref={dropdownRef}
              className="
     bg-white/90 backdrop-blur-md
            border border-gray-200 shadow-sm
    rounded-[28px]
    px-4 py-3
    flex items-center gap-6
    overflow-x-auto overflow-y-visible
    whitespace-nowrap
    scrollbar-hide  overscroll-x-contain 
    md:flex-wrap md:overflow-visible md:whitespace-normal
    relative z-50
  "
            >
              {/* Deposit */}
              <div className="relative shrink-0  p-2 rounded-2xl">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDesktop.deposit ? closeAll() : openFilter("deposit");
                  }}
                  className="flex flex-col text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Deposit
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm">
                    {noDeposit ? "No Deposit" : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openDesktop.deposit && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className=" absolute left-0 top-full mt-3 z-[9999] bg-white w-56 rounded-2xl shadow-xl border border-gray-100 p-4"
                  >
                    <label className="flex items-center gap-2 py-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={noDeposit}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          dispatch(setCatalogFilters({ noDeposit: checked }));
                          applyFilters({ noDeposit: checked });
                        }}
                        className="accent-site-primary"
                      />
                      No Deposit
                    </label>
                  </div>
                )}
              </div>

              <Divider />

              {/* Body Type */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDesktop.bodyType ? closeAll() : openFilter("bodyType");
                  }}
                  className="flex flex-col text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Body Type
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm">
                    {bodyType.length ? `${bodyType.length} selected` : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openDesktop.bodyType && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="hidden md:block absolute left-0 top-full mt-3 z-[9999] bg-white w-72 shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    {data?.bodyTypes?.map((bt) => (
                      <label
                        key={bt._id}
                        className="flex items-center gap-2 py-1 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={bodyType.includes(bt._id)}
                          onChange={() => {
                            const updated = bodyType.includes(bt._id)
                              ? bodyType.filter((x: string) => x !== bt._id)
                              : [...bodyType, bt._id];

                            dispatch(setCatalogFilters({ bodyType: updated }));
                            applyFilters({ bodyType: updated });
                          }}
                          className="accent-site-primary"
                        />
                        {bt.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Divider />

              {/* Sort */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-gray-700">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    const newSort = e.target.value;
                    setSort(newSort);
                    dispatch(setCatalogFilters({ sort: newSort }));
                    applyFilters({ sort: newSort });
                  }}
                  className="w-56 h-11 px-4 rounded-2xl border border-gray-200 bg-white text-gray-700 text-sm outline-none"
                >
                  <option value="newest">Newest Cars</option>
                  <option value="lowestPrice">Price: Low to High</option>
                  <option value="highestPrice">Price: High to Low</option>
                  <option value="mostBooked">Most Booked</option>
                </select>
              </div>

              {/* ✅ FULL SCREEN FILTER BUTTON */}
              <div className="ml-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenFullFilter(true)}
                  className="
                  flex items-center gap-2
                  bg-gradient-to-r from-site-accent to-slate-teal text-white
                  px-6 py-3 rounded-full
                  text-sm font-semibold
                  shadow-md hover:opacity-95 transition max-w-
                "
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openFullFilter && (
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[2px] flex">
          {/* LEFT DRAWER */}
          <div
            className="fixed left-0 top-0 h-screen w-[92%] max-w-[420px] bg-white flex flex-col shadow-2xl rounded-r-3xl overflow-hidden
translate-x-0 transition-transform duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-0 z-50">
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                Filters
              </h2>

              <button
                onClick={() => setOpenFullFilter(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50">
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCategory((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Category
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {category.length ? `${category.length} selected` : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openCategory && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Categories
                    </p>

                    <div className="space-y-2">
                      {data?.categories?.map((cat) => {
                        const active = category.includes(cat._id);

                        return (
                          <label
                            key={cat._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? category.filter(
                                      (x: string) => x !== cat._id,
                                    )
                                  : [...category, cat._id];

                                dispatch(
                                  setCatalogFilters({ category: updated }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />

                            <span className="flex-1">
                              {cat.name}{" "}
                              <span className="text-xs text-gray-500">
                                ({cat.cars})
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenCategory(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenBrand((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Brand
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {brand.length ? `${brand.length} selected` : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openBrand && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Brands
                    </p>

                    <div className="space-y-2">
                      {data?.brands?.map((br) => {
                        const active = brand.includes(br._id);

                        return (
                          <label
                            key={br._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? brand.filter((x: string) => x !== br._id)
                                  : [...brand, br._id];

                                dispatch(setCatalogFilters({ brand: updated }));
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{br.name}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenBrand(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Transmission */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setopenTransmission((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Transmission
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {transmission.length
                      ? `${transmission.length} selected`
                      : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openTransmission && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Transmission
                    </p>

                    <div className="space-y-2">
                      {data?.transmissions?.map((tr) => {
                        const active = transmission.includes(tr._id);

                        return (
                          <label
                            key={tr._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? transmission.filter(
                                      (x: string) => x !== tr._id,
                                    )
                                  : [...transmission, tr._id];

                                dispatch(
                                  setCatalogFilters({ transmission: updated }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{tr.transmission}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setopenTransmission(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Seating */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSeating((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Seating Capacity
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {seatingCapacity.length
                      ? `${seatingCapacity.length} selected`
                      : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openSeating && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Seating Capacity
                    </p>

                    <div className="space-y-2">
                      {data?.seatingCapacities?.map((sc) => {
                        const active = seatingCapacity.includes(sc._id);

                        return (
                          <label
                            key={sc._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? seatingCapacity.filter(
                                      (x: string) => x !== sc._id,
                                    )
                                  : [...seatingCapacity, sc._id];

                                dispatch(
                                  setCatalogFilters({
                                    seatingCapacity: updated,
                                  }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{sc.seats} Seats</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenSeating(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Body Type */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenBodyType((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Body Type
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {bodyType.length ? `${bodyType.length} selected` : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openBodyType && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Body Type
                    </p>

                    <div className="space-y-2">
                      {data?.bodyTypes?.map((bt) => {
                        const active = bodyType.includes(bt._id);

                        return (
                          <label
                            key={bt._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? bodyType.filter((x: string) => x !== bt._id)
                                  : [...bodyType, bt._id];

                                dispatch(
                                  setCatalogFilters({ bodyType: updated }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{bt.name}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenBodyType(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Interior Color */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenInterior((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Interior Color
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {interiorColor.length
                      ? `${interiorColor.length} selected`
                      : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openInterior && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Interior Color
                    </p>

                    <div className="space-y-2">
                      {data?.carColors?.map((clr) => {
                        const active = interiorColor.includes(clr._id);

                        return (
                          <label
                            key={clr._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? interiorColor.filter(
                                      (x: string) => x !== clr._id,
                                    )
                                  : [...interiorColor, clr._id];

                                dispatch(
                                  setCatalogFilters({ interiorColor: updated }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{clr.name}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenInterior(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Exterior Color */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenExterior((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Exterior Color
                  </span>

                  <span className="text-gray-500 border border-gray-200 bg-white p-3 rounded-2xl w-full flex items-center justify-between text-sm mt-2">
                    {exteriorColor.length
                      ? `${exteriorColor.length} selected`
                      : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openExterior && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-3 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Exterior Color
                    </p>

                    <div className="space-y-2">
                      {data?.carColors?.map((clr) => {
                        const active = exteriorColor.includes(clr._id);

                        return (
                          <label
                            key={clr._id}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => {
                                const updated = active
                                  ? exteriorColor.filter(
                                      (x: string) => x !== clr._id,
                                    )
                                  : [...exteriorColor, clr._id];

                                dispatch(
                                  setCatalogFilters({ exteriorColor: updated }),
                                );
                              }}
                              className="accent-site-primary w-4 h-4"
                            />
                            <span className="flex-1">{clr.name}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenExterior(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-5 py-4 bg-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:border-site-accent hover:text-site-accent transition"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyFilters();
                    setOpenFullFilter(false);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold shadow-md hover:opacity-95 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Helpers */
function Divider() {
  return <div className="h-9 w-px bg-gray-200 shrink-0" />;
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full border text-xs font-semibold transition
        ${
          active
            ? "bg-gradient-to-r from-site-accent to-slate-teal text-white border-site-accent"
            : "bg-white border-gray-200 text-gray-700 hover:border-site-accent/40"
        }`}
    >
      {label}
    </button>
  );
}
