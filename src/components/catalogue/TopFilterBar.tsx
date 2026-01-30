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
  Users,
  Palette,
  Settings2,
  Shapes,
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
    bodyType = [],
    category = [],
    brand = [],
    seatingCapacity = [],
    transmission = [],
    exteriorColor = [],
    interiorColor = [],
  } = filters;

  const [sort, setSort] = useState(filters?.sort || "newest");

  const [openDesktop, setOpenDesktop] = useState({
    deposit: false,
    price: false,
    brand: false,
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
      brand: false,
      sort: false,
      [key]: true,
    });
  };

  const closeAll = () => {
    setOpenDesktop({
      deposit: false,
      price: false,
      brand: false,
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
      <div className="relative z-10 backdrop-blur-md">
        <div className="w-full">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Choose a car
              </h2>

              <button
                type="button"
                onClick={() => setOpenFullFilter(true)}
                className="
                flex items-center gap-2
                bg-gradient-to-r from-site-accent to-slate-teal text-white
                px-6 py-3 rounded-full
                text-sm font-semibold
                shadow-md hover:opacity-95 transition
              "
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div
            ref={dropdownRef}
          className="
  rounded-[28px]
  px-4 py-3
  flex items-center gap-6

  overflow-visible
  whitespace-nowrap
  scrollbar-hide
  overscroll-x-contain

  md:flex-wrap
  md:overflow-visible
  md:whitespace-normal

  relative z-50
"


          >
            {/* Deposit */}
             <div className="hidden md:block relative shrink-0 p-1 rounded-2xl">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDesktop.deposit ? closeAll() : openFilter("deposit");
                }}
                className="flex flex-col text-left"
              >
                <span
                  className="flex items-center justify-between
             w-[150px] h-9 px-3
md:w-[220px] md:h-11 md:px-5

               rounded-full border border-gray-200 bg-white
               text-gray-800 text-sm font-medium
               shadow-sm hover:shadow-md transition"
                >
                  {noDeposit ? "No Deposit" : "Deposit"}
                  <ChevronDown size={16} />
                </span>
              </button>

             {openDesktop.deposit && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full z-[9999] bg-white w-[220px] rounded-2xl shadow-xl border border-gray-100 p-4 ml-1"
            >
              <label className="flex items-center gap-1 py-1 text-sm text-gray-700">
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
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDesktop.brand ? closeAll() : openFilter("brand");
                }}
                className="flex items-center"
              >
                <span
                  className="flex items-center justify-between
                   w-[120px] h-9 px-3
md:w-[220px] md:h-11 md:px-5

                    rounded-full border border-gray-200 bg-white
                    text-gray-800 text-sm font-medium
                    shadow-sm hover:shadow-md transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      Brand
                    </span>

                    {brand.length > 0 && (
                      <span
                        className="w-[10px] sm:min-w-[22px] h-[22px] px-2
                      flex items-center justify-center
                      rounded-full bg-site-accent text-white
                      text-xs font-semibold"
                      >
                        {brand.length}
                      </span>
                    )}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openDesktop.brand ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {openDesktop.brand && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full  mt-1 z-[9999] bg-white w-40 sm:w-56 shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
                >
                  {data?.brands?.map((bt) => (
                    <label
                      key={bt._id}
                      className="flex items-center gap-2 py-1 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={brand.includes(bt._id)}
                        onChange={() => {
                          const updated = brand.includes(bt._id)
                            ? brand.filter((x: string) => x !== bt._id)
                            : [...brand, bt._id];

                          dispatch(setCatalogFilters({ brand: updated }));
                          applyFilters({ brand: updated });
                        }}
                        className="accent-site-primary"
                      />
                      {bt.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className=" flex items-center gap-3 shrink-0">
              <span className="text-sm font-semibold text-gray-900">Sort</span>
              <select
                value={sort}
                onChange={(e) => {
                  const newSort = e.target.value;
                  setSort(newSort);
                  dispatch(setCatalogFilters({ sort: newSort }));
                  applyFilters({ sort: newSort });
                }}
                className="flex items-center justify-between
             w-[150px] h-9 px-3
              md:w-[220px] md:h-11 md:px-5

               rounded-full border border-gray-200 bg-white
               text-gray-800 text-sm font-medium
               shadow-sm hover:shadow-md transition"
              >
                <option value="newest">Newest Cars</option>
                <option value="lowestPrice">Price: High to Low</option>
                <option value="highestPrice">Price: Low to High</option>
                <option value="mostBooked">Most Booked</option>
              </select>
            </div>

            {/* ✅ FULL SCREEN FILTER BUTTON */}
          </div>
        </div>
      </div>
      {openFullFilter && (
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[2px] flex">
          {/* LEFT DRAWER */}
          <div
            className="fixed left-0 top-0 h-screen w-[100%] max-w-[420px] bg-white flex flex-col shadow-2xl rounded-r-3xl overflow-hidden
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
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50">
              <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCategory((prev) => !prev);
                  }}
                  className="flex flex-col text-left w-full"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <LayoutGrid className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Car className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Settings2 className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Users className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Shapes className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Palette className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Palette className="w-4 h-4 text-site-accent" />
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
                    className="absolute left-0 top-full mt-1 z-[9999] bg-white w-full shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto"
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



 