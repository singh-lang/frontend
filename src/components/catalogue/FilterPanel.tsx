"use client";

import { useEffect, useState } from "react";
import { Filter, Car, Shield, ChevronUp, ChevronDown } from "lucide-react";

import { useLazyApplyFiltersQuery } from "@/lib/api/catalog";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import {
  setCatalogFilters,
  removeCatalogFilters,
} from "@/lib/slice/catalogFiltersSlice";

import { setCatalogCars, setCarsLoading } from "@/lib/slice/catalogCarsSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { getFilters } from "@/util/helper";

interface FiltersPanelProps {
  data: {
    categories: { _id: string; name: string; cars: number }[];
    brands: { _id: string; name: string; logo: { url: string } }[];
    bodyTypes: { _id: string; name: string }[];

    regionalSpecs: { _id: string; name: string }[];

    seatingCapacities: { _id: string; seats: number }[];

    transmissions: { _id: string; transmission: string }[];

    carColors: { _id: string; name: string }[];
  };
}

export default function FiltersPanel({ data }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [isExpanded, setIsExpanded] = useState(true);

  const [getCars, { data: filteredCars, isFetching }] =
    useLazyApplyFiltersQuery();

  const filters = useAppSelector((s) => s.catalogFilters);

  const {
    category,
    brand,
    regionalSpec,
    seatingCapacity,
    transmission,
    interiorColor,
    exteriorColor,
  } = filters;

  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsExpanded(!touch);
  }, []);

  const applyFilters = () => {
    const page = Number(searchParams.get("page") || 1);
    const sendFilters = getFilters({ ...filters, page });

    getCars(sendFilters)
      .unwrap()
      .then((res) => {
        dispatch(
          setCatalogCars({
            carsData: res.data.docs,
            page: res.data.page,
            totalPages: res.data.totalPages,
          })
        );

        router.push(`/catalog/all/cars?page=1`, { scroll: false });
      });
  };

  const clearFilters = () => {
    dispatch(removeCatalogFilters());

    getCars({ page: 1 })
      .unwrap()
      .then((res) => {
        dispatch(
          setCatalogCars({
            carsData: res.data.docs,
            page: res.data.page,
            totalPages: res.data.totalPages,
          })
        );
      });

    router.push(`/catalog/all/cars?page=1`, { scroll: false });
  };

  useEffect(() => {
    if (!filteredCars?.data) return;

    dispatch(
      setCatalogCars({
        carsData: filteredCars.data.docs,
        page: filteredCars.data.page,
        totalPages: filteredCars.data.totalPages,
      })
    );
  }, [filteredCars]);

  useEffect(() => {
    dispatch(setCarsLoading({ isLoading: isFetching }));
  }, [isFetching]);

  return (
    <div className="w-full sm:w-[320px] flex-shrink-0 mb-4 sm:mb-0">
      <div className="bg-white sm:sticky top-[140px] rounded-2xl shadow-lg overflow-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-br from-site-primary to-slate-teal/30 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5" />
            <h3 className="text-xl font-bold">Filters</h3>
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* BODY */}
        <div
          className={`transition-all ${
            isExpanded
              ? "p-6 max-h-[calc(100vh-80px)] overflow-y-auto"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* APPLY + CLEAR */}
          <div className="mt-4 mb-8 flex gap-4">
            <button
              onClick={applyFilters}
              className="w-1/2 bg-site-primary text-white py-3 rounded-xl"
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              className="w-1/2 bg-gray-200 text-black py-3 rounded-xl"
            >
              Clear
            </button>
          </div>

          {/* CATEGORY */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-5 h-5 text-site-accent" />
              <h4 className="font-semibold text-site-primary">Category</h4>
            </div>

            {data.categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={category.includes(cat._id)}
                  onChange={() => {
                    const updated = category.includes(cat._id)
                      ? category.filter((x) => x !== cat._id)
                      : [...category, cat._id];
                    dispatch(setCatalogFilters({ category: updated }));
                  }}
                />

                <span>{cat.name}</span>
                <span className="opacity-60">({cat.cars})</span>
              </label>
            ))}
          </div>

          {/* BRAND */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">Brand</h4>

            <div className="max-h-[220px] overflow-y-auto space-y-2">
              {data.brands.map((br) => (
                <label key={br._id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={brand.includes(br._id)}
                    onChange={() => {
                      const updated = brand.includes(br._id)
                        ? brand.filter((x) => x !== br._id)
                        : [...brand, br._id];
                      dispatch(setCatalogFilters({ brand: updated }));
                    }}
                  />
                  <span>{br.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* REGIONAL SPECS */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">
              Regional Specs
            </h4>

            {data.regionalSpecs.map((rs) => (
              <label key={rs._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={regionalSpec.includes(rs._id)}
                  onChange={() => {
                    const updated = regionalSpec.includes(rs._id)
                      ? regionalSpec.filter((x) => x !== rs._id)
                      : [...regionalSpec, rs._id];
                    dispatch(setCatalogFilters({ regionalSpec: updated }));
                  }}
                />
                <span>{rs.name}</span>
              </label>
            ))}
          </div>

          {/* SEATING CAPACITY */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">
              Seating Capacity
            </h4>

            {data.seatingCapacities.map((sc) => (
              <label key={sc._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={seatingCapacity.includes(sc._id)}
                  onChange={() => {
                    const updated = seatingCapacity.includes(sc._id)
                      ? seatingCapacity.filter((x) => x !== sc._id)
                      : [...seatingCapacity, sc._id];
                    dispatch(setCatalogFilters({ seatingCapacity: updated }));
                  }}
                />
                <span>{sc.seats} Seats</span>
              </label>
            ))}
          </div>

          {/* TRANSMISSION */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">
              Transmission
            </h4>

            {data.transmissions.map((tr) => (
              <label key={tr._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={transmission.includes(tr._id)}
                  onChange={() => {
                    const updated = transmission.includes(tr._id)
                      ? transmission.filter((x) => x !== tr._id)
                      : [...transmission, tr._id];
                    dispatch(setCatalogFilters({ transmission: updated }));
                  }}
                />
                <span>{tr.transmission}</span>
              </label>
            ))}
          </div>

          {/* INTERIOR COLOR */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">
              Interior Color
            </h4>

            {data.carColors.map((clr) => (
              <label key={clr._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={interiorColor.includes(clr._id)}
                  onChange={() => {
                    const updated = interiorColor.includes(clr._id)
                      ? interiorColor.filter((x) => x !== clr._id)
                      : [...interiorColor, clr._id];
                    dispatch(setCatalogFilters({ interiorColor: updated }));
                  }}
                  className="w-5 h-5 border-2 border-gray-300 rounded"
                />
                <span>{clr.name}</span>
              </label>
            ))}
          </div>

          {/* EXTERIOR COLOR */}
          <div className="mb-8">
            <h4 className="font-semibold text-site-primary mb-2">
              Exterior Color
            </h4>

            {data.carColors.map((clr) => (
              <label key={clr._id} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={exteriorColor.includes(clr._id)}
                  onChange={() => {
                    const updated = exteriorColor.includes(clr._id)
                      ? exteriorColor.filter((x) => x !== clr._id)
                      : [...exteriorColor, clr._id];
                    dispatch(setCatalogFilters({ exteriorColor: updated }));
                  }}
                  className="w-5 h-5 border-2 border-gray-300 rounded"
                />
                <span>{clr.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
