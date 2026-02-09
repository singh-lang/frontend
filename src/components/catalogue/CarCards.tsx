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

  const { carsData } = useAppSelector((s) => s.catalogCars);

  const [getAllCars] = useLazyGetAllCarsQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = searchParams.get("query")?.trim();

    setLoading(true);

    getAllCars(search ? { search } : undefined)
      .unwrap()
      .then((res) => {
        dispatch(
          setCatalogCars({
            carsData: res.listings || [],
            // page: 1,
            // totalPages: 1,
          }),
        );
      })
      .catch(() => {
        dispatch(
          setCatalogCars({
            carsData: [],
            // page: 1,
            // totalPages: 1,
          }),
        );
      })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  return (
    <>
    {loading && (
      <>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <HorizontalCarCardSkeleton key={i} />
        ))}
      </>
    )}

    {!loading && carsData.length > 0 &&
      carsData.map((car) => (
        <HorizontalCarCard key={car._id} car={car} />
      ))
    }

    {!loading && carsData.length === 0 && (
      <div className="text-center text-xl font-bold">
        No Cars Found
      </div>
    )}
  </>
);
};

export default CarCards;
