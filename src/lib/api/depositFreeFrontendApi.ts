import { baseApi } from "./baseApi";

export interface DepositFreePricing {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface DepositFreeResponse {
  success: boolean;
  data: DepositFreePricing | null;
}

export const depositFreeFrontendApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * 🌍 FRONTEND – GET ONLY
     * Fetch deposit-free pricing for booking page
     */
    getDepositFreePricingFrontend: builder.query<DepositFreeResponse, string>({
      query: (listingId) => `/deposit-free/${listingId}`,
    }),
  }),
});

export const { useGetDepositFreePricingFrontendQuery } = depositFreeFrontendApi;
