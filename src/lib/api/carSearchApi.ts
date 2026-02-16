import { baseApi } from "@/lib/api/baseApi";
import type { CarTypes } from "@/types/homePageTypes";

/* ================= TYPES ================= */

export interface SearchQueryArgs {
  query: string;
}

export interface SearchResponse {
  success: boolean;
  result: CarTypes[];
  totalResults: number;
}

/* ================= API ================= */

export const carSearchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /* ---------- SEARCH CARS ---------- */
    getSearchedCars: builder.query<SearchResponse, SearchQueryArgs>({
      query: ({ query }) => ({
        url: "/cars/search-by-any-field",
        params: { query },
      }),

      transformResponse: (response: any): SearchResponse => ({
        success: response?.success ?? true,
        result:
          response?.result ??
          response?.listings ??
          response?.data ??
          [],
        totalResults:
          response?.totalResults ??
          response?.total ??
          response?.result?.length ??
          0,
      }),
    }),

    /* ---------- ALL CARS (NO PAGINATION) ---------- */
    getAllCars: builder.query<SearchResponse, void>({
      query: () => ({
        url: "/cars/getAllListingsWithoutPagination",
      }),

      transformResponse: (response: any): SearchResponse => ({
        success: response?.success ?? true,
        result:
          response?.result ??
          response?.listings ??
          response?.data ??
          [],
        totalResults:
          response?.totalResults ??
          response?.total ??
          response?.result?.length ??
          0,
      }),
    }),
  }),
});

/* ================= HOOK EXPORTS ================= */

export const {
  useGetSearchedCarsQuery,
  useLazyGetSearchedCarsQuery,
  useGetAllCarsQuery,
  useLazyGetAllCarsQuery,
} = carSearchApi;
