import { baseApi } from "./baseApi";

export type AddonPriceType =
  | "per_day"
  | "per_week"
  | "per_month"
  | "per_booking";

export interface CarVendorAddon {
  _id: string;
  name: string;
  description?: string;
  price: number;
  priceType: AddonPriceType;
}

export interface CarVendorAddonsResponse {
  success: boolean;
  data: CarVendorAddon[];
}

export const carAddonsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAddonsByCar: builder.query<CarVendorAddonsResponse, string>({
      query: (carId) => ({
        // ✅ Backend route (change if your backend URL differs)
        url: `/addons/by-car/${carId}`,
        method: "GET",
      }),
      providesTags: ["CarAddonsByCar"],
    }),
  }),
});

export const { useGetAddonsByCarQuery } = carAddonsApi;

export default carAddonsApi;
