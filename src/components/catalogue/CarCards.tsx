"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";

import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";

const CarCards = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { carsData } = useAppSelector((s) => s.catalogCars);

  const [getSearchedCars, { isFetching }] = useLazyGetSearchedCarsQuery();

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const search = searchParams.get("query")?.trim();

    if (!search) {
      dispatch(setCatalogCars({ carsData: [] }));
      setFirstLoad(false);
      return;
    }

    getSearchedCars({ query: search })
      .unwrap()
      .then((res) => {
        dispatch(
          setCatalogCars({
            carsData: res.result || [],
          })
        );
      })
      .catch(() => {
        dispatch(setCatalogCars({ carsData: [] }));
      })
      .finally(() => setFirstLoad(false));
  }, [searchParams.toString()]);

  return (
    <>
      {firstLoad && isFetching &&
        Array.from({ length: 4 }).map((_, i) => (
          <HorizontalCarCardSkeleton key={i} />
        ))}

      {carsData.map((car) => (
        <HorizontalCarCard key={car._id} car={car} />
      ))}

      {!isFetching && carsData.length === 0 && (
        <div className="text-center text-xl font-bold">
          No Cars Found
        </div>
      )}
    </>
  );
};

export default CarCards;
