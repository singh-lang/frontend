"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import HorizontalCarCard from "./HorizontalCarCard";
import HorizontalCarCardSkeleton from "./HorizontalCarCardSkeleton";
import Pagination from "../shared/Pagination";

import {
  useLazyApplyFiltersQuery,
  useLazyFetchCatalogDataQuery,
} from "@/lib/api/catalog";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCatalogCars, setCarsLoading } from "@/lib/slice/catalogCarsSlice";

import {
  fetchCars,
  getFilters,
  getUrlSearchParams,
  hasActiveFilters,
} from "@/util/helper";

import { CarTypes } from "@/types/homePageTypes";

interface CarCardsProps {
  data: {
    docs: CarTypes[];
    page: number;
    totalPages: number;
  };
}

const CarCards = ({ data }: CarCardsProps) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const filterType = params.filterType as string;
  const filterId = params.filterId as string;

  const [getCars, { isFetching }] = useLazyApplyFiltersQuery();
  const [getCatalogCars, { isFetching: isCatalogFetching }] =
    useLazyFetchCatalogDataQuery();

  const { carsData, page, totalPages, isLoading } = useAppSelector(
    (s) => s.catalogCars
  );

  const filtersState = useAppSelector((s) => s.catalogFilters);

  const searchFilters = useMemo(
    () => getUrlSearchParams(searchParams, "object"),
    [searchParams]
  );

  /** 🔥 FIRST RENDER = always fetch correct page */
  // useEffect(() => {
  //   const urlPage = Number(searchParams.get("page") || 1);

  //   fetchCars({
  //     getCars,
  //     getCatalogCars,
  //     router,
  //     hasActive: hasActiveFilters(filtersState),
  //     filters: getFilters({ ...filtersState, page: urlPage }),
  //     searchFilters,
  //     setCars: (payload) =>
  //       dispatch(
  //         setCatalogCars({
  //           carsData: payload.docs,
  //           page: payload.page,
  //           totalPages: payload.totalPages,
  //         })
  //       ),
  //     filterType,
  //     filterId,
  //     page: urlPage,
  //     sort: filtersState.sort,
  //     searchParams,
  //   });
  // }, []);
  useEffect(() => {
    const urlPage = Number(searchParams.get("page") || 1);

    fetchCars({
      getCars,
      getCatalogCars,
      router,
      hasActive: hasActiveFilters(filtersState),
      filters: getFilters({ ...filtersState, page: urlPage }),
      searchFilters,
      setCars: (payload) =>
        dispatch(
          setCatalogCars({
            carsData: payload.docs,
            page: payload.page,
            totalPages: payload.totalPages,
          })
        ),
      filterType,
      filterId,
      page: urlPage,
      sort: filtersState.sort,
      searchParams,
    });
  }, [
    searchParams.toString(), // ✅ KEY LINE
  ]);

  /** GLOBAL LOADING */
  useEffect(() => {
    dispatch(setCarsLoading({ isLoading: isFetching || isCatalogFetching }));
  }, [isFetching, isCatalogFetching]);

  /** PAGINATE */
  const paginate = (newPage: number) => {
    const paramsCopy = new URLSearchParams(searchParams);
    paramsCopy.set("page", String(newPage));
    router.push(`?${paramsCopy}`, { scroll: false });

    fetchCars({
      getCars,
      getCatalogCars,
      router,
      hasActive: hasActiveFilters(filtersState),
      filters: getFilters({ ...filtersState, page: newPage }),
      searchFilters,
      setCars: (payload) =>
        dispatch(
          setCatalogCars({
            carsData: payload.docs,
            page: payload.page,
            totalPages: payload.totalPages,
          })
        ),
      filterType,
      filterId,
      page: newPage,
      sort: filtersState.sort,
      searchParams,
    });

    window.scrollTo(0, 0);
  };

  return (
    <>
      {isLoading ? (
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
