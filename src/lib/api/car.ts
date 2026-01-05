import type { CarTypes } from "@/types/homePageTypes";
import { notFound } from "next/navigation";
import { baseApi } from "./baseApi";

interface CarFetchProp {
  _id: string;
  data: CarTypes;
}

const carApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createClick: builder.mutation({
      query: ({ carId, body }) => ({
        url: `/click/add/${carId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateClickMutation } = carApi;

export const getCar = async (carId: string): Promise<CarFetchProp> => {
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