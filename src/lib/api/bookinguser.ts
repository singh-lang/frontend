import { keyof } from "zod";
import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBookings: build.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).map(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            urlParams.append(key, String(val));
          }
        });

        const paramsString = urlParams.toString();

        return {
          url: `/bookings${paramsString ? `?${paramsString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["AllBookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useLazyGetBookingsQuery } = bookingApi;
