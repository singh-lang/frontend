"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";

import {
  useLazyGetSearchedCarsQuery,
  useLazyGetAllCarsQuery,
} from "@/lib/api/carSearchApi";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";

const CarCards = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

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
      getSearchedCars({ query: search })
        .unwrap()
        .then((res) => {
          dispatch(setCatalogCars({ carsData: res.result || [] }));
        })
        .catch(() => {
          dispatch(setCatalogCars({ carsData: [] }));
        })
        .finally(() => setFirstLoad(false));
    }

    // 📦 BROWSE MODE (ALL CARS)
    else {
      getAllCars()
        .unwrap()
        .then((res) => {
          dispatch(setCatalogCars({ carsData: res.result || [] }));
        })
        .catch(() => {
          dispatch(setCatalogCars({ carsData: [] }));
        })
        .finally(() => setFirstLoad(false));
    }
  }, [searchParams.toString()]);

  const loading = searchLoading || allLoading;

  return (
    <>
      {firstLoad && loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <HorizontalCarCardSkeleton key={i} />
        ))}

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
