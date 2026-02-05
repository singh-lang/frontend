import { baseApi } from "./baseApi";

export interface ApplyCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ApplyCouponResponse {
  couponId: string;
  couponType: "PERCENTAGE" | "AMOUNT";
  originalAmount: number;
  discount: number;
  finalAmount: number;
}

const couponApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    applyCoupon: builder.mutation<
      { success: boolean; data: ApplyCouponResponse },
      ApplyCouponRequest
    >({
      query: (body) => ({
        url: "/apply-coupon",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useApplyCouponMutation } = couponApi;
export default couponApi;
