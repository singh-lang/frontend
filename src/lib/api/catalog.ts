// lib/api/catalog.ts
import type { SearchParams } from "@/types/catalog";
import type { CarTypes } from "@/types/homePageTypes";
import { notFound } from "next/navigation";
import { baseApi } from "./baseApi";

/* --------------------------- TYPES --------------------------- */

export interface ApiCarResponse {
  success: boolean;
  data: {
    docs: CarTypes[];
    page: number;
    totalPages: number;
  };
}

export type FilterValues =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | undefined;

/* ---------------------- URL PARAM APPENDER ---------------------- */

function appendParamsSafe(
  urlParams: URLSearchParams,
  params: Record<string, FilterValues>,
) {
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, String(v)));
    } else {
      urlParams.append(key, String(value));
    }
  });
}

/* ---------------------- FETCH CATALOG DATA ---------------------- */
export const getCatalogData = async (
  filterType: string,
  filterId: string,
  pageNum?: number | string,
): Promise<ApiCarResponse> => {
  const page = pageNum ? `?page=${pageNum}` : "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cars/${filterType}/${filterId}${page}`,
    { next: { revalidate: 450 } },
  );

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to fetch listings.");

  return res.json() as Promise<ApiCarResponse>;
};

/* ---------------------- FILTERED DATA ---------------------- */
export const getFilteredData = async (
  params: SearchParams = {},
): Promise<ApiCarResponse> => {
  const search = new URLSearchParams();
  appendParamsSafe(search, params);

  const qs = search.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cars/filter${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed filtered listings");

  return res.json() as Promise<ApiCarResponse>;
};

/* ---------------------- MASTER DATA ---------------------- */
export const getFilterMasterData = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cars/filter/master-data`,
  );

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed master-data");

  return res.json();
};

/* ---------------------- RTK API ---------------------- */
const catalogApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    applyFilters: builder.query<ApiCarResponse, Record<string, FilterValues>>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        appendParamsSafe(params, filters);
        const q = params.toString();

        return {
          url: `/cars/filter${q ? `?${q}` : ""}`,
          method: "GET",
        };
      },
    }),

    fetchCatalogData: builder.query<
      ApiCarResponse,
      { filterType: string; filterId: string; page?: number; sort?: string }
    >({
      query: ({ filterType, filterId, page, sort }) => {
        const p = new URLSearchParams();
        if (page) p.set("page", String(page));
        if (sort) p.set("sort", String(sort));

        return {
          url: `/cars/${filterType}/${filterId}?${p.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});
const sanitizeSearchParams = (params: URLSearchParams) => {
  const allowed = ["search", "page", "limit", "sort"];

  const clean = new URLSearchParams();

  allowed.forEach((key) => {
    const value = params.get(key);
    if (value) clean.set(key, value);
  });

  return clean.toString();
};

export const { useLazyApplyFiltersQuery, useLazyFetchCatalogDataQuery } =
  catalogApi;
