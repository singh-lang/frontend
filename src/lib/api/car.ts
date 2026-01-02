import type { CarTypes } from "@/types/homePageTypes";
import { notFound } from "next/navigation";
import { baseApi } from "./baseApi";

interface CarFetchProp {
  _id: string;
  data: CarTypes;
}

/* ================= RTK QUERY API ================= */
const carApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ✅ GET CAR BY ID (RTK QUERY)
    getCarById: builder.query<CarTypes, string>({
      query: (carId) => `/car/${carId}`,
      transformResponse: (response: { data: CarTypes }) => response.data,
    }),

    // ✅ CREATE CLICK
    createClick: builder.mutation<unknown, { carId: string; body: any }>({
      query: ({ carId, body }) => ({
        url: `/click/add/${carId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

/* ✅ EXPORT HOOKS */
export const { useGetCarByIdQuery, useCreateClickMutation } = carApi;

/* ================= SERVER-SIDE FETCH ================= */
export const getCar = async (carId: string): Promise<CarFetchProp> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/car/${carId}`,
      { cache: "no-store" }
    );

    if (res.status === 404) {
      notFound();
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch car. Status: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};
