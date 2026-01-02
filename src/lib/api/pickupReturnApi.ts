import { baseApi } from "./baseApi";

export const pickupReturnApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    calculatePickupReturn: builder.mutation<
      {
        success: boolean;
        pickupCharge: number;
        returnCharge: number;
        totalExtra: number;
      },
      {
        carId: string;
        emirateId: string;
        pickupType: "PICKUP" | "DELIVERY";
        returnType: "DROPOFF" | "RETURN";
      }
    >({
      query: (body) => ({
        url: "/calculate-emirate-pickup-return",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCalculatePickupReturnMutation } = pickupReturnApi;
