// src/lib/api/carSearchApi.ts
import { baseApi } from "@/lib/api/baseApi";




export const carSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchedCars: builder.query({
      query: (param) => {
        const searchParams = new URLSearchParams();
        if (param) searchParams.append("search", param);

        const queryString = searchParams.toString();

        return {
          url: `cars/search${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: false,
});

// ✅ Export both standard and lazy hooks
export const { useGetSearchedCarsQuery, useLazyGetSearchedCarsQuery } = carSearchApi;
