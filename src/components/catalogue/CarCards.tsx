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
import { useLazyGetSearchedCarsQuery } from "@/lib/api/carSearchApi";

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

  const [searchCars] = useLazyGetSearchedCarsQuery();
  const [getCars] = useLazyApplyFiltersQuery();
  const [getCatalogCars] = useLazyFetchCatalogDataQuery();

  const filterType = params.filterType as string;
  const filterId = params.filterId as string;

  const { carsData, page, totalPages } = useAppSelector((s) => s.catalogCars);
  const filtersState = useAppSelector((s) => s.catalogFilters);

  const searchFilters = useMemo(
    () => getUrlSearchParams(searchParams, "object"),
    [searchParams],
  );
  const [showSkeleton, setShowSkeleton] = useState(true);
  const skeletonShownRef = useRef(false);
  const isPaginatingRef = useRef(false);
  useEffect(() => {
    const urlPage = Number(searchParams.get("page") || 1);
    const query = searchParams.get("query")?.trim();

    if (query) {
      setShowSkeleton(true);

      searchCars({ query, page: urlPage })
        .unwrap()
        .then((res) => {
          dispatch(
            setCatalogCars({
              carsData: res.result || [],
              page: res.page || 1,
              totalPages: res.totalPages || 1,
            }),
          );
        })
        .catch(() => {
          dispatch(
            setCatalogCars({
              carsData: [],
              page: 1,
              totalPages: 1,
            }),
          );
        })
        .finally(() => setShowSkeleton(false));

      return;
    }

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
          }),
        );
        skeletonShownRef.current = true;
        setShowSkeleton(false);
        isPaginatingRef.current = false;
      },
      filterType,
      filterId,
      page: urlPage,
      sort: filtersState.sort,
      searchParams,
    });
  }, [searchParams.toString()]);

  const paginate = (newPage: number) => {
    isPaginatingRef.current = true;
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
