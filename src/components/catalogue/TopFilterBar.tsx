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
  Users,
  Palette,
  Settings2,
  Shapes,
  Check,
} from "lucide-react";

type IdName = {
  _id: string;
  name: string;
};

type Category = IdName & { cars?: number };
type Seating = { _id: string; seats: number };
type Transmission = { _id: string; transmission: string };

type TopFiltersBarProps = {
  data: {
    brands?: IdName[];
    categories?: Category[];
    transmissions?: Transmission[];
    seatingCapacities?: Seating[];
    bodyTypes?: IdName[];
    carColors?: IdName[];
  };
};

export default function TopFiltersBar({ data }: TopFiltersBarProps) {
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
    brand = [],
    category = [],
    transmission = [],
    seatingCapacity = [],
    bodyType = [],
    interiorColor = [],
    exteriorColor = [],
  } = filters;

  const [sort, setSort] = useState(filters?.sort || "newest");

  const [openDesktop, setOpenDesktop] = useState({
    deposit: false,
    brand: false,
  });

  const [openFullFilter, setOpenFullFilter] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [getCars] = useLazyApplyFiltersQuery();

  /* ---------------- helpers ---------------- */

  const openFilter = (key: "deposit" | "brand") => {
    setOpenDesktop({ deposit: false, brand: false, [key]: true });
  };

  const closeAll = () => {
    setOpenDesktop({ deposit: false, brand: false });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const applyFilters = async (extra = {}) => {
    const final = getFilters({
      ...filters,
      ...extra,
      page: 1,
      sort,
    });

    const res = await getCars(final).unwrap();
    dispatch(
      setCatalogCars({
        carsData: res.data.docs,
        page: res.data.page,
        totalPages: res.data.totalPages,
      }),
    );
    router.push(`/catalog/all/cars?page=1`, { scroll: false });
  };

  const clearFilters = async () => {
    dispatch(removeCatalogFilters());
    setSort("newest");

    const res = await getCars({ page: 1 }).unwrap();
    dispatch(
      setCatalogCars({
        carsData: res.data.docs,
        page: res.data.page,
        totalPages: res.data.totalPages,
      }),
    );
    setOpenFullFilter(false);
    closeAll();
  };

const [openSort, setOpenSort] = useState(false);

const sortOptions = [
  { value: "newest", label: "Newest Cars" },
  { value: "lowestPrice", label: "Price: High to Low" },
  { value: "highestPrice", label: "Price: Low to High" },
  { value: "mostBooked", label: "Most Booked" },
];
const selectedSortLabel =
  sortOptions.find((opt) => opt.value === sort)?.label || "Sort";

  return (
    <>
      {/* HEADER */}
      <div className="relative z-10">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Choose a car
            </h2>

            <button
              onClick={() => setOpenFullFilter(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                         bg-gradient-to-r from-site-accent to-slate-teal
                         text-white font-semibold"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* FILTER BAR (DESKTOP + MOBILE) */}
        <div ref={dropdownRef} className=" px-4 py-3">

          <div className="flex items-center gap-3 md:gap-6">

            {/* Deposit */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDesktop.deposit ? closeAll() : openFilter("deposit");
                }}
                     className="flex items-center justify-between
                w-[150px] h-9 px-3
                md:w-[220px] md:h-11 md:px-5

               rounded-full border border-gray-200 bg-white
               text-gray-800 text-sm font-medium
               shadow-sm hover:shadow-md transition"
              >
                {noDeposit ? "No Deposit" : "Deposit"}
                <ChevronDown size={16} />
              </button>

              {openDesktop.deposit && (
                <div   className="mt-1 absolute left-0 top-full   z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md" >

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={noDeposit}
                      onChange={(e) => {
                        dispatch(
                          setCatalogFilters({ noDeposit: e.target.checked }),
                        );
                        applyFilters({ noDeposit: e.target.checked });
                      }}
                    />
                    No Deposit
                  </label>
                </div>
              )}
            </div>

            {/* Brand */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDesktop.brand ? closeAll() : openFilter("brand");
                }}
         
                  className="flex items-center justify-between
             w-[150px] h-9 px-3
            md:w-[220px] md:h-11 md:px-5
               rounded-full border border-gray-200 bg-white
               text-gray-800 text-sm font-medium
               shadow-sm hover:shadow-md transition"
                >

    
                <span className="flex items-center gap-2">
                  Brand
                  {brand.length > 0 && (
                    <span className="px-2 rounded-full bg-site-accent text-white text-xs ">
                      {brand.length}
                    </span>
                  )}
                </span>
                <ChevronDown size={16} />
              </button>

              {openDesktop.brand && (
                <div    className="mt-1 absolute left-0 top-full  z-[9999] bg-white  w-full sm:w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md" >

                  {data?.brands?.map((b) => (
                    <label key={b._id} className="flex gap-2 text-sm py-1">
                      <input
                        type="checkbox"
                        checked={brand.includes(b._id)}
                        onChange={() => {
                          const updated = brand.includes(b._id)
                            ? brand.filter((x: string) => x !== b._id)
                            : [...brand, b._id];
                          dispatch(setCatalogFilters({ brand: updated }));
                          applyFilters({ brand: updated });
                        }}
                      />
                      {b.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

      <div className=" hidden md:block relative flex-1 md:flex-none">
 <button
  onClick={(e) => {
    e.stopPropagation();
    setOpenSort((p) => !p);
  }}
  className="
    flex items-center justify-between
    w-[150px] md:w-[220px]
    h-9 md:h-11
    px-4 md:px-5
    rounded-full md:rounded-xl
   bg-white
    border border-soft-grey/40
    text-gray-800 text-sm  font-medium
    shadow-sm hover:shadow-md
    transition
  "
>
  <span className="truncate">
    {selectedSortLabel}
  </span>
  <ChevronDown size={16} />
</button>

{openSort && (
  <div
    className="
      absolute left-0 top-full mt-2 z-[9999]
      w-[220px]
      bg-gradient-to-br from-off-white to-white
      border border-soft-grey/40
      rounded-xl
      shadow-xl
      p-2
      space-y-1
    "
  >
    {sortOptions.map((opt) => (
      <button
  key={opt.value}
  type="button"
  onClick={() => {
    setSort(opt.value);
    dispatch(setCatalogFilters({ sort: opt.value }));
    applyFilters({ sort: opt.value });
    setOpenSort(false);
  }}
  className={`
    w-full flex items-center justify-between
    px-3 py-2 rounded-lg
    text-sm font-medium
    transition
    ${
      sort === opt.value
        ? " text-white bg-site-accent "
        : "text-gray-700 hover:bg-site-accent/10"
    }
  `}
>
  <span>{opt.label}</span>

  {sort === opt.value && (
    <Check className="w-4 h-4 font-medium text-white" />
  )}
</button>

    ))}
  </div>
)}
</div>

          </div>
       <div className="mt-3 md:hidden flex items-center justify-center gap-2">
          <span className="font-semibold text-sm shrink-0">
            Sort
          </span>

          <select
            value={sort}
            onChange={(e) => {
              const newSort = e.target.value;
              setSort(newSort);
              dispatch(setCatalogFilters({ sort: newSort }));
              applyFilters({ sort: newSort });
            }}
            className="
             
              h-9 px-3
              rounded-full border border-gray-200 bg-white
              text-gray-800 text-sm font-medium
              shadow-sm hover:shadow-md transition
            "
          >
            <option value="newest">Newest Cars</option>
            <option value="lowestPrice">Price: High to Low</option>
            <option value="highestPrice">Price: Low to High</option>
            <option value="mostBooked">Most Booked</option>
          </select>
        </div>
        </div>
      </div>

      {/* FULL FILTER DRAWER */}
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
             className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"                  >
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
              {/* <div className="relative bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
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
              </div> */}

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
                  className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"

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
             className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"                  >
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
             className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"                  >
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
             className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"                  >
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
             className="absolute left-0 top-full  mt-1 z-[9999] bg-white  w-full max-h-72 overflow-y-auto
                            bg-gradient-to-br from-off-white to-white border border-soft-grey/40 rounded-lg md:rounded-xl 
                            px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-site-primary font-semibold focus:outline-none
                           focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"                  >
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
