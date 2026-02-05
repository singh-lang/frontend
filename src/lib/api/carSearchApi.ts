import { baseApi } from "@/lib/api/baseApi";
import type { CarTypes } from "@/types/homePageTypes";

export interface SearchQueryArgs {
  query: string;
  page?: number;
}

export interface SearchResponse {
  success: boolean;
  result: CarTypes[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export const carSearchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSearchedCars: builder.query<SearchResponse, SearchQueryArgs>({
      query: ({ query, page = 1 }) => {
        const params = new URLSearchParams();

        if (query && query.trim()) {
          params.append("query", query.trim());
        }

        params.append("page", String(page));

        return {
          url: `/cars/search-by-any-field?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetSearchedCarsQuery, useLazyGetSearchedCarsQuery } =
  carSearchApi;
