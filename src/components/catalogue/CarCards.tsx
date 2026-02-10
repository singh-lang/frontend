"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";

import { useLazyGetAllCarsQuery } from "@/lib/api/allcarapi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";

const CarCards = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
const SKELETON_COUNT = 10;
  const [firstLoad, setFirstLoad] = useState(true);

  const { carsData } = useAppSelector((s) => s.catalogCars);

const [getAllCars, { isFetching }] = useLazyGetAllCarsQuery();
  // const [loading, setLoading] = useState(true);

 useEffect(() => {
  const search = searchParams.get("query")?.trim();

  getAllCars(search ? { search } : undefined)
    .unwrap()
    .then((res) => {
      dispatch(
        setCatalogCars({
          carsData: res.listings || [],
        }),
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
