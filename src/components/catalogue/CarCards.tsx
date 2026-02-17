"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";

import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import { useLazyGetAllCarsQuery } from "@/lib/api/allcarapi";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";
import { CarTypes } from "@/types/homePageTypes";
const CarCards = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  interface CatalogCarsState {
  carsData: CarTypes[];
}
const initialState: CatalogCarsState = {
  carsData: [],
};
  const { carsData } = useAppSelector((s) => s.catalogCars);

  const [getSearchedCars, { isFetching: searchLoading }] =
    useLazyGetSearchedCarsQuery();

  const [getAllCars, { isFetching: allLoading }] =
    useLazyGetAllCarsQuery();

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const search = searchParams.get("query")?.trim();

    // 🔎 SEARCH MODE
    if (search) {
      getSearchedCars({ query: search, page: 1 })
        .unwrap()
        .then((res) => {
          dispatch(setCatalogCars({ carsData: res.result || [] }));
        })
        .catch(() => {
          dispatch(setCatalogCars({ carsData: [] }));
        })
        .finally(() => setFirstLoad(false));
    }

    // 📦 ALL CARS MODE
    else {
      getAllCars()
        .unwrap()
        .then((res) => {
          dispatch(setCatalogCars({ carsData: res.listings || [] }));
        })
        .catch(() => {
          dispatch(setCatalogCars({ carsData: [] }));
        })
        .finally(() => setFirstLoad(false));
    }
  }, [searchParams.toString()]);

  const loading = searchLoading || allLoading;

  if (loading && firstLoad) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <HorizontalCarCardSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {carsData.map((car) => (
        <HorizontalCarCard key={car._id} car={car} />
      ))}

      {!loading && carsData.length === 0 && (
        <div className="text-center text-xl font-bold">
          No Cars Found
        </div>
      )}
    </>
  );
};

export default CarCards;
