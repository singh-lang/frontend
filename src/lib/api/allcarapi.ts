// lib/api/allCarsApi.ts
import type { CarTypes } from "@/types/homePageTypes";
import { baseApi } from "./baseApi";
import { notFound } from "next/navigation";

/* --------------------------- TYPES --------------------------- */

export interface AllCarsResponse {
  success: boolean;
  total: number;
  listings: CarTypes[];
    data: CarTypes | null;

}


export const getCar = async (carId: string): Promise<AllCarsResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/car/${carId}`,
      {
        cache: "no-store",
      }
    );
    if (res.status === 404) {
      notFound();
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch listings. Status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};
const allCarsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCars: builder.query<AllCarsResponse, { search?: string } | void>({
      query: (params) => {
        let url = "/cars/getAllListingsWithoutPagination";

        if (params?.search) {
          const qs = new URLSearchParams({ search: params.search });
          url += `?${qs.toString()}`;
        }

        return {
          url,
          method: "GET",
        };
      },
    }),
  }),
});

/* ---------------------- EXPORT HOOK ---------------------- */

export const { useLazyGetAllCarsQuery, useGetAllCarsQuery } = allCarsApi;
