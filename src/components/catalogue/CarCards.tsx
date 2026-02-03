"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";
import Pagination from "../shared/Pagination";

import {
  useLazyApplyFiltersQuery,
  useLazyFetchCatalogDataQuery,
} from "@/lib/api/catalog";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars } from "@/lib/slice/catalogCarsSlice";

import {
  fetchCars,
  getFilters,
  getUrlSearchParams,
  hasActiveFilters,
} from "@/util/helper";

const CarCards = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const filterType = params.filterType as string;
  const filterId = params.filterId as string;

  const [getCars] = useLazyApplyFiltersQuery();
  const [getCatalogCars] = useLazyFetchCatalogDataQuery();

  const { carsData, page, totalPages } = useAppSelector(
    (s) => s.catalogCars
  );

  const filtersState = useAppSelector((s) => s.catalogFilters);

  const searchFilters = useMemo(
    () => getUrlSearchParams(searchParams, "object"),
    [searchParams]
  );

  // 🔑 LOCAL UI STATE (ONLY FOR SKELETON)
  const [showSkeleton, setShowSkeleton] = useState(true);
  const skeletonShownRef = useRef(false);

 useEffect(() => {
  const urlPage = Number(searchParams.get("page") || 1);

  // Skeleton ONLY first load
  if (!skeletonShownRef.current && !isPaginatingRef.current) {
    setShowSkeleton(true);
  }

  fetchCars({
    getCars,
    getCatalogCars,
    router,
    hasActive: hasActiveFilters(filtersState),
    filters: getFilters({ ...filtersState, page: urlPage }),
    searchFilters,
    setCars: (payload) => {
      dispatch(
        setCatalogCars({
          carsData: payload.docs,
          page: payload.page,
          totalPages: payload.totalPages,
        })
      );

      skeletonShownRef.current = true;
      setShowSkeleton(false);

      // 🔑 pagination done
      isPaginatingRef.current = false;
    },
    filterType,
    filterId,
    page: urlPage,
    sort: filtersState.sort,
    searchParams,
  });
}, [searchParams.toString(), dispatch]);

const isPaginatingRef = useRef(false);

  const paginate = (newPage: number) => {
  isPaginatingRef.current = true; // 👈 IMPORTANT

  const paramsCopy = new URLSearchParams(searchParams);
  paramsCopy.set("page", String(newPage));
  router.push(`?${paramsCopy}`, { scroll: false });
  window.scrollTo(0, 0);
};


  return (
    <>
      {showSkeleton ? (
        Array.from({ length: 10 }).map((_, i) => (
          <HorizontalCarCardSkeleton key={i} />
        ))
      ) : carsData.length > 0 ? (
        carsData.map((c) => <HorizontalCarCard key={c._id} car={c} />)
      ) : (
        <div className="text-center text-xl font-bold">No Cars Found</div>
      )}

      <Pagination totalPages={totalPages} page={page} onPageChange={paginate} />
    </>
  );
};

export default CarCards;
