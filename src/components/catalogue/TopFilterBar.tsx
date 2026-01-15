"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
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
import FiltersPanelNewDesign from "./FilterPanel"; // ✅ correct import
import { Select } from "react-day-picker";

export default function TopFiltersBar({ data }) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useAppSelector((s) => s.catalogFilters);
  const {
    noDeposit,
    priceRange,
    brand,
    bodyType,
    category,
    regionalSpec,
    seatingCapacity,
    transmission,
    exteriorColor,
    interiorColor,
  } = filters;
  const [sort, setSort] = useState("newest");
  const [openDesktop, setOpenDesktop] = useState({
    deposit: false,
    price: false,
    brand: false,
    bodyType: false,
    advanced: false,
  });

  const [openMobile, setOpenMobile] = useState<
    null | "deposit" | "price" | "brand" | "bodyType" | "advanced"
  >(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [getCars] = useLazyApplyFiltersQuery();
  const applyFilters = () => {
    setOpenDesktop({
      deposit: false,
      price: false,
      brand: false,
      bodyType: false,
      advanced: false,
    });
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

    setOpenDesktop({
      deposit: false,
      price: false,
      brand: false,
      bodyType: false,
      advanced: false,
    });
  };
  const openFilter = (key) => {
    if (window.innerWidth < 768) {
      setOpenMobile(key);
    } else {
      setOpenDesktop({
        deposit: key === "deposit",
        price: key === "price",
        brand: key === "brand",
        bodyType: key === "bodyType",
        advanced: key === "advanced",
      });
    }
  };

  useEffect(() => {
    if (openMobile) return; // ⛔ DO NOT close on mobile

    const handler = (e: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDesktop({
          deposit: false,
          price: false,
          brand: false,
          bodyType: false,
          advanced: false,
        });
      }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [openMobile]);

  type FiltersPanelProps = {
    data: {
      categories: { _id: string; name: string; cars: number }[];
      brands: { _id: string; name: string }[];
      regionalSpecs: { _id: string; name: string }[];
      seatingCapacities: { _id: string; seats: number }[];
      transmissions: { _id: string; transmission: string }[];
      carColors: { _id: string; name: string }[];
    };
    onApply?: () => void;
    onClear?: () => void;
  };
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    return (
      <div className="mb-6 ">
        <h4 className="text-sm font-extrabold text-gray-900 mb-2">{title}</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
          {children}
        </div>
      </div>
    );
  };
  const selectedPrice = Array.isArray(priceRange) ? priceRange[1] ?? 0 : 0;

  const Chip = ({
    active,
    label,
    onClick,
  }: {
    active: boolean;
    label: string;
    onClick: () => void;
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-3 py-2 rounded-full border text-xs font-semibold transition-all
      ${
        active
          ? "bg-site-accent text-white border-site-accent shadow-sm"
          : "bg-white border-gray-200 text-gray-700 hover:border-site-accent/40 hover:bg-site-accent/5"
      }`}
      >
        {label}
      </button>
    );
  };
  const FooterButton = () => {
    return (
      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            className="
            flex-1 h-12 rounded-2xl
            border border-gray-200 bg-white
            text-gray-700 font-semibold
            hover:border-site-accent hover:text-site-accent
            transition
          "
          >
            Clear
          </button>

          <button
            type="button"
            onClick={applyFilters}
            className="
            flex-1 h-12 rounded-2xl
            bg-gradient-to-r from-site-accent to-slate-teal
            text-white font-semibold
            shadow-md hover:opacity-95 transition
          "
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };
  const [tempBrand, setTempBrand] = useState<string[]>([]);

  useEffect(() => {
    if (openMobile === "brand") {
      setTempBrand(brand);
    }
  }, [openMobile]);

  function MobileBottomSheet({
    title,
    open,
    onClose,
    onClear,
    onApply,
    children,
  }: {
    title: string;
    open: boolean;
    onClose: () => void;
    onClear?: () => void;
    onApply?: () => void;
    children: React.ReactNode;
  }) {
    if (!open) return null;

    return (
      <div className="md:hidden">
        {/* ✅ Overlay */}
        <div
          className="fixed inset-0 bg-black/40 z-[9998] pointer-events-auto"
          onClick={onClose}
        />

        {/* ✅ Sheet */}
        <div
          className="
          fixed bottom-0 left-0 right-0 z-[9999]
          bg-white rounded-t-3xl shadow-2xl
          max-h-[85vh]
          flex flex-col
          pointer-events-auto touch-manipulation
        "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-base font-extrabold text-gray-900">{title}</h3>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 overflow-y-auto flex-1 pointer-events-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t bg-white pointer-events-auto">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClear}
                className="flex-1 h-12 rounded-2xl border border-gray-300 font-semibold text-gray-700"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={onApply}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedBodyType = Array.isArray(bodyType) ? bodyType : [];
  return (
    <>
      <div className="sticky top-[70px] z-[30] w-full">
        <div className="w-full pb-5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div
              ref={dropdownRef}
              className="
            bg-white/90 backdrop-blur-md
            border border-gray-200 shadow-sm
            rounded-[28px]
            px-4 py-3
            flex items-center gap-3
            overflow-x-auto whitespace-nowrap
            scrollbar-hide
            overscroll-x-contain 
            md:flex-wrap md:overflow-x-visible md:whitespace-normal
          "
            >
              <div className="relative shrink-0 ">
                <button
                  onClick={() => openFilter("deposit")}
                  className="flex flex-col text-left"
                >
                  <span className="text-sm font-semibold">Deposit</span>
                  <span className="text-gray-600 flex items-center gap-1 text-sm">
                    {noDeposit ? "No Deposit" : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openDesktop.deposit && (
                  <div className=" hidden md:block absolute left-0 top-full mt-3 z-[9999]  bg-white w-56 rounded-2xl shadow-2xl border border-gray-100 p-4">
                    <label className="flex items-center gap-2 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={noDeposit}
                        onChange={(e) => {
                          const checked = e.target.checked;

                          // 1) redux update
                          dispatch(setCatalogFilters({ noDeposit: checked }));

                          // 2) API call + cars update
                          setTimeout(() => {
                            const final = getFilters({
                              ...filters,
                              noDeposit: checked,
                              page: 1,
                              sort,
                            });

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

                            router.push(`/catalog/all/cars?page=1`, {
                              scroll: false,
                            });
                          }, 0);
                        }}
                      />
                      No Deposit
                    </label>
                  </div>
                )}
              </div>

              <Divider />
              <div className="relative shrink-0">
                <button
                  onClick={() => openFilter("price")}
                  className="flex flex-col text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Price
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm">
                    AED {(priceRange?.[1] ?? 0).toLocaleString()}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openDesktop.price && (
                  <div className="hidden md:block absolute left-0 top-full mt-3 z-[9999] bg-white w-72 shadow-xl rounded-2xl p-4 border border-gray-100">
                    {/* ✅ Selected value below */}
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                      Selected Price: AED{" "}
                      {(priceRange?.[1] ?? 0).toLocaleString()}
                    </p>

                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={priceRange?.[1] ?? 0}
                      onChange={(e) =>
                        dispatch(
                          setCatalogFilters({
                            priceRange: [0, Number(e.target.value)],
                          })
                        )
                      }
                      className="w-full accent-site-primary"
                    />

                    <div className="flex justify-between text-xs mt-2 text-gray-500">
                      <span>AED 0</span>
                      <span>AED 5000+</span>
                    </div>

                    <FooterButton />
                  </div>
                )}
              </div>

              <Divider />
              {/* BODY TYPE */}
              <div className="relative shrink-0">
                <button
                  onClick={() => openFilter("bodyType")}
                  className="flex flex-col text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Body Type
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm">
                    {bodyType?.length
                      ? `${bodyType.length} selected`
                      : "Select"}
                    <ChevronDown size={16} />
                  </span>
                </button>

                {openDesktop.bodyType && (
                  <div className="hidden md:block absolute left-0 top-full mt-3 z-[9999] bg-white w-72 shadow-xl rounded-2xl p-4 border border-gray-100 max-h-72 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Select Body Types
                    </p>

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
                            setTimeout(() => {
                              const final = getFilters({
                                ...filters,
                                bodyType: updated,
                                page: 1,
                                sort,
                              });

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

                              router.push(`/catalog/all/cars?page=1`, {
                                scroll: false,
                              });
                            }, 0);
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
              <div className="min-w-[280px] h-12 flex-1">
                <CatalogSearchBox />
              </div>
              <Divider />
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-gray-700">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    const newSort = e.target.value;
                    setSort(newSort);

                    // ✅ auto apply sorting
                    setTimeout(() => {
                      const final = getFilters({
                        ...filters,
                        page: 1,
                        sort: newSort,
                      });

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

                      router.push(`/catalog/all/cars?page=1`, {
                        scroll: false,
                      });
                    }, 0);
                  }}
                  className="
                w-60 h-12 px-4
                rounded-2xl border border-gray-200
                bg-white text-gray-700 text-sm
                outline-none
              "
                >
                  <option value="newest">Newest Cars</option>
                  <option value="lowestPrice">Price: Low to High</option>
                  <option value="highestPrice">Price: High to Low</option>
                  <option value="mostBooked">Most Booked</option>
                </select>
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() => openFilter("advanced")}
                  className="flex items-center gap-2
                  bg-gradient-to-r from-site-accent to-slate-teal text-white
                  px-6 py-3 rounded-full
                  text-sm font-semibold
                  shadow-md hover:opacity-95 transition
                "
                >
                  Filter
                </button>

                {openDesktop.advanced && (
                  <div className="hidden md:block absolute right-0 top-full mt-3 z-[9999] bg-white w-100 shadow-xl rounded-2xl p-4 border border-gray-100 max-h-120 overflow-y-auto">
                    <Section title="Category">
                      <div className="flex flex-wrap gap-2">
                        {data.categories.map((cat) => {
                          const active = category.includes(cat._id);
                          return (
                            <Chip
                              key={cat._id}
                              active={active}
                              label={`${cat.name} (${cat.cars})`}
                              onClick={() => {
                                const updated = active
                                  ? category.filter(
                                      (x: string) => x !== cat._id
                                    )
                                  : [...category, cat._id];
                                dispatch(
                                  setCatalogFilters({ category: updated })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Brand">
                      <div className="grid grid-cols-3 gap-2">
                        {data.brands.map((br) => {
                          const active = brand.includes(br._id);
                          return (
                            <button
                              key={br._id}
                              type="button"
                              onClick={() => {
                                const updated = active
                                  ? brand.filter((x: string) => x !== br._id)
                                  : [...brand, br._id];
                                dispatch(setCatalogFilters({ brand: updated }));
                              }}
                              className={`px-3 py-3 rounded-2xl border text-sm font-semibold transition
                                            ${
                                              active
                                                ? "bg-site-accent/10 border-site-accent text-site-accent"
                                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                            >
                              {br.name}
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Regional Specs">
                      <div className="grid grid-cols-3 gap-2">
                        {data.regionalSpecs.map((rs) => {
                          const active = regionalSpec.includes(rs._id);
                          return (
                            <button
                              key={rs._id}
                              type="button"
                              onClick={() => {
                                const updated = active
                                  ? regionalSpec.filter(
                                      (x: string) => x !== rs._id
                                    )
                                  : [...regionalSpec, rs._id];
                                dispatch(
                                  setCatalogFilters({ regionalSpec: updated })
                                );
                              }}
                              className={`px-2 py-3 rounded-2xl border text-xs font-bold transition text-center
                                    ${
                                      active
                                        ? "bg-site-primary text-white border-site-primary shadow-sm"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-site-primary/40"
                                    }`}
                            >
                              {rs.name}
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Seating Capacity">
                      <div className="grid grid-cols-4 gap-2">
                        {data.seatingCapacities.map((sc) => {
                          const active = seatingCapacity.includes(sc._id);
                          return (
                            <Chip
                              key={sc._id}
                              active={active}
                              label={`${sc.seats} Seats`}
                              onClick={() => {
                                const updated = active
                                  ? seatingCapacity.filter(
                                      (x: string) => x !== sc._id
                                    )
                                  : [...seatingCapacity, sc._id];
                                dispatch(
                                  setCatalogFilters({
                                    seatingCapacity: updated,
                                  })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Transmission">
                      <div className="flex flex-wrap gap-2">
                        {data.transmissions.map((tr) => {
                          const active = transmission.includes(tr._id);
                          return (
                            <Chip
                              key={tr._id}
                              active={active}
                              label={tr.transmission}
                              onClick={() => {
                                const updated = active
                                  ? transmission.filter(
                                      (x: string) => x !== tr._id
                                    )
                                  : [...transmission, tr._id];
                                dispatch(
                                  setCatalogFilters({ transmission: updated })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Interior Color">
                      <div className="grid grid-cols-3 gap-2">
                        {data.carColors.map((clr) => {
                          const active = interiorColor.includes(clr._id);
                          return (
                            <Chip
                              key={clr._id}
                              active={active}
                              label={clr.name}
                              onClick={() => {
                                const updated = active
                                  ? interiorColor.filter(
                                      (x: string) => x !== clr._id
                                    )
                                  : [...interiorColor, clr._id];
                                dispatch(
                                  setCatalogFilters({ interiorColor: updated })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </Section>
                    <Section title="Exterior Color">
                      <div className="grid grid-cols-3 gap-2">
                        {data.carColors.map((clr) => {
                          const active = exteriorColor.includes(clr._id);
                          return (
                            <Chip
                              key={clr._id}
                              active={active}
                              label={clr.name}
                              onClick={() => {
                                const updated = active
                                  ? exteriorColor.filter(
                                      (x: string) => x !== clr._id
                                    )
                                  : [...exteriorColor, clr._id];
                                dispatch(
                                  setCatalogFilters({ exteriorColor: updated })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </Section>
                    <FooterButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomSheet
        title="Brand"
        open={openMobile === "brand"}
        onClose={() => setOpenMobile(null)}
        onClear={() => setTempBrand([])}
        onApply={() => {
          dispatch(setCatalogFilters({ brand: tempBrand }));

          const final = getFilters({
            ...filters,
            brand: tempBrand,
            page: 1,
            sort,
          });

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
          setOpenMobile(null);
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          {data?.brands?.map((b) => {
            const active = tempBrand.includes(b._id);

            return (
              <button
                key={b._id}
                type="button"
                onClick={() => {
                  setTempBrand((prev) =>
                    prev.includes(b._id)
                      ? prev.filter((x) => x !== b._id)
                      : [...prev, b._id]
                  );
                }}
                className={`px-3 py-3 rounded-2xl border text-sm font-semibold transition
            ${
              active
                ? "bg-site-accent/10 border-site-accent text-site-accent"
                : "bg-white border-gray-200 text-gray-700"
            }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>
      <MobileBottomSheet
        title="Price (AED)"
        open={openMobile === "price"}
        onClose={() => setOpenMobile(null)}
        onClear={() => {
          dispatch(setCatalogFilters({ priceRange: [0, 0] }));
        }}
        onApply={() => {
          const final = getFilters({
            ...filters,
            page: 1,
            sort,
          });

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
          setOpenMobile(null);
        }}
      >
        <div className="space-y-5">
          {/* Selected Value */}
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Selected Price
          </p>
          <p className="text-base font-extrabold text-gray-900">
            AED {(priceRange?.[1] ?? 0).toLocaleString()}
          </p>

          {/* Slider */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Choose Max Price
            </p>

            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={priceRange?.[1] ?? 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                dispatch(setCatalogFilters({ priceRange: [0, value] }));
              }}
              className="w-full accent-site-primary"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>AED 0</span>
              <span>AED 5000+</span>
            </div>
          </div>
        </div>
      </MobileBottomSheet>

      <MobileBottomSheet
        title="Deposit"
        open={openMobile === "deposit"}
        onClose={() => setOpenMobile(null)}
        onClear={() => dispatch(setCatalogFilters({ noDeposit: false }))}
        onApply={() => {
          applyFilters();
          setOpenMobile(null);
        }}
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() =>
              dispatch(setCatalogFilters({ noDeposit: !noDeposit }))
            }
            className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-left
        ${
          noDeposit
            ? "border-site-accent bg-site-accent/10 text-site-accent"
            : "border-gray-200 bg-white text-gray-700"
        }`}
          >
            No Deposit
          </button>
        </div>
      </MobileBottomSheet>

      <MobileBottomSheet
        title="Body Type"
        open={openMobile === "bodyType"}
        onClose={() => setOpenMobile(null)}
        onClear={() => dispatch(setCatalogFilters({ bodyType: [] }))}
        onApply={() => {
          applyFilters();
          setOpenMobile(null);
        }}
      >
        <div className="flex flex-wrap gap-3">
          {data?.bodyTypes?.map((bt) => {
            const active = bodyType.includes(bt._id);

            return (
              <button
                key={bt._id}
                type="button"
                onClick={() => {
                  const updated = active
                    ? bodyType.filter((x: string) => x !== bt._id)
                    : [...bodyType, bt._id];

                  dispatch(setCatalogFilters({ bodyType: updated }));
                }}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition
            ${
              active
                ? "border-site-accent text-site-accent bg-site-accent/10"
                : "border-gray-200 text-gray-700 bg-white"
            }`}
              >
                {bt.name}
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>

      <MobileBottomSheet
        title="Filters"
        open={openMobile === "advanced"}
        onClose={() => setOpenMobile(null)}
        onClear={clearFilters}
        onApply={() => {
          applyFilters();
          setOpenMobile(null);
        }}
      >
        <div className="flex flex-wrap gap-3">
          {data?.bodyTypes?.map((bt) => {
            const active = bodyType.includes(bt._id);

            return (
              <button
                key={bt._id}
                type="button"
                onClick={() => {
                  const updated = active
                    ? bodyType.filter((x: string) => x !== bt._id)
                    : [...bodyType, bt._id];

                  dispatch(setCatalogFilters({ bodyType: updated }));
                }}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition
            ${
              active
                ? "border-site-accent text-site-accent bg-site-accent/10"
                : "border-gray-200 text-gray-700 bg-white"
            }`}
              >
                {bt.name}
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>

      <MobileBottomSheet
        title="Filters"
        open={openMobile === "advanced"}
        onClose={() => setOpenMobile(null)}
        onClear={clearFilters}
        onApply={() => {
          applyFilters();
          setOpenMobile(null);
        }}
      >
        <div className="space-y-6">
          <Section title="Category">
            <div className="flex flex-wrap gap-2">
              {data?.categories?.map((cat) => {
                const active = category.includes(cat._id);
                return (
                  <Chip
                    key={cat._id}
                    active={active}
                    label={`${cat.name} (${cat.cars})`}
                    onClick={() => {
                      const updated = active
                        ? category.filter((x: string) => x !== cat._id)
                        : [...category, cat._id];
                      dispatch(setCatalogFilters({ category: updated }));
                    }}
                  />
                );
              })}
            </div>
          </Section>

          <Section title="Brand">
            <div className="grid grid-cols-3 gap-2">
              {data?.brands?.map((br) => {
                const active = brand.includes(br._id);
                return (
                  <button
                    key={br._id}
                    type="button"
                    onClick={() => {
                      const updated = active
                        ? brand.filter((x: string) => x !== br._id)
                        : [...brand, br._id];
                      dispatch(setCatalogFilters({ brand: updated }));
                    }}
                    className={`px-3 py-3 rounded-2xl border text-sm font-semibold transition
                ${
                  active
                    ? "bg-site-accent/10 border-site-accent text-site-accent"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
                  >
                    {br.name}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Regional Specs">
            <div className="grid grid-cols-3 gap-2">
              {data?.regionalSpecs?.map((rs) => {
                const active = regionalSpec.includes(rs._id);
                return (
                  <button
                    key={rs._id}
                    type="button"
                    onClick={() => {
                      const updated = active
                        ? regionalSpec.filter((x: string) => x !== rs._id)
                        : [...regionalSpec, rs._id];
                      dispatch(setCatalogFilters({ regionalSpec: updated }));
                    }}
                    className={`px-3 py-3 rounded-2xl border text-sm font-semibold transition
                ${
                  active
                    ? "bg-site-primary text-white border-site-primary"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
                  >
                    {rs.name}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Seating Capacity">
            <div className="grid grid-cols-4 gap-2">
              {data?.seatingCapacities?.map((sc) => {
                const active = seatingCapacity.includes(sc._id);
                return (
                  <Chip
                    key={sc._id}
                    active={active}
                    label={`${sc.seats} Seats`}
                    onClick={() => {
                      const updated = active
                        ? seatingCapacity.filter((x: string) => x !== sc._id)
                        : [...seatingCapacity, sc._id];
                      dispatch(setCatalogFilters({ seatingCapacity: updated }));
                    }}
                  />
                );
              })}
            </div>
          </Section>

          <Section title="Transmission">
            <div className="flex flex-wrap gap-2">
              {data?.transmissions?.map((tr) => {
                const active = transmission.includes(tr._id);
                return (
                  <Chip
                    key={tr._id}
                    active={active}
                    label={tr.transmission}
                    onClick={() => {
                      const updated = active
                        ? transmission.filter((x: string) => x !== tr._id)
                        : [...transmission, tr._id];
                      dispatch(setCatalogFilters({ transmission: updated }));
                    }}
                  />
                );
              })}
            </div>
          </Section>

          <Section title="Interior Color">
            <div className="grid grid-cols-3 gap-2">
              {data?.carColors?.map((clr) => {
                const active = interiorColor.includes(clr._id);
                return (
                  <Chip
                    key={clr._id}
                    active={active}
                    label={clr.name}
                    onClick={() => {
                      const updated = active
                        ? interiorColor.filter((x: string) => x !== clr._id)
                        : [...interiorColor, clr._id];
                      dispatch(setCatalogFilters({ interiorColor: updated }));
                    }}
                  />
                );
              })}
            </div>
          </Section>

          <Section title="Exterior Color">
            <div className="grid grid-cols-3 gap-2">
              {data?.carColors?.map((clr) => {
                const active = exteriorColor.includes(clr._id);
                return (
                  <Chip
                    key={clr._id}
                    active={active}
                    label={clr.name}
                    onClick={() => {
                      const updated = active
                        ? exteriorColor.filter((x: string) => x !== clr._id)
                        : [...exteriorColor, clr._id];
                      dispatch(setCatalogFilters({ exteriorColor: updated }));
                    }}
                  />
                );
              })}
            </div>
          </Section>
        </div>
      </MobileBottomSheet>
    </>
  );
}

function Divider() {
  return <div className="h-9 w-px bg-gray-200 shrink-0" />;
}
