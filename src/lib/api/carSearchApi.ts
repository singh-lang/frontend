import { baseApi } from "@/lib/api/baseApi";
import type { CarTypes } from "@/types/homePageTypes";

/* ================= TYPES ================= */

export interface SearchQueryArgs {
  query: string;
    page?: number;   
}

export interface CarsApiResponse {
  success: boolean;
  result: CarTypes[];
  totalResults: number;
}

/* ================= API ================= */

export const carSearchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /* 🔎 SEARCH CARS */
    getSearchedCars: builder.query<CarsApiResponse, SearchQueryArgs>({
      query: ({ query }) => ({
        url: "/cars/search-by-any-field",
        params: { query },
      }),
    }),

    getAllCars: builder.query<CarsApiResponse, void>({
      query: () => ({
        url: "/cars/getAllListingsWithoutPagination",
      }),
    }),
  }),
});


export const {
  useGetSearchedCarsQuery,
  useLazyGetSearchedCarsQuery,
  useGetAllCarsQuery,
  useLazyGetAllCarsQuery,
} = carSearchApi;
