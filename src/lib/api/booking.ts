import { baseApi } from "./baseApi";

const bookingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    calculateBooking: builder.mutation({
      query: (body) => ({
        url: "/booking/calculation",
        method: "POST",
        body,
      }),
    }),

    createBooking: builder.mutation({
      query: (body) => ({
        url: "/booking/create",
        method: "POST",
        body: {
          ...body,
          isGuest: true, // ✅ FORCE GUEST FLAG HERE
        },
      }),
    }),
  }),
});

export const { useCalculateBookingMutation, useCreateBookingMutation } =
  bookingApi;
